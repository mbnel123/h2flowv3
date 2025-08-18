// src/firebase/databaseService.ts
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './config.js';
import { errorService } from '../services/errorService.ts';

// Fast interface
export interface Fast {
  id?: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  plannedDuration: number; // hours
  actualDuration?: number; // hours
  status: 'active' | 'completed' | 'stopped_early' | 'paused';
  waterIntake: WaterEntry[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterEntry {
  id?: string;
  timestamp: Date;
  amount: number; // ml
  note?: string;
}

// Real-time listener type
export type FastListener = (fast: Fast | null) => void;
export type UnsubscribeFunction = () => void;

// Start a new fast with error handling
export const startFast = async (userId: string, plannedDuration: number) => {
  return await errorService.retry(async () => {
    console.log('🚀 Database: Starting fast for user:', userId, 'duration:', plannedDuration);
    
    const fastData: Omit<Fast, 'id'> = {
      userId,
      startTime: new Date(),
      plannedDuration,
      status: 'active',
      waterIntake: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'fasts'), {
      ...fastData,
      startTime: Timestamp.fromDate(fastData.startTime),
      createdAt: Timestamp.fromDate(fastData.createdAt),
      updatedAt: Timestamp.fromDate(fastData.updatedAt)
    });

    console.log('✅ Database: Fast created with ID:', docRef.id);
    return { id: docRef.id, error: null };
  }, {
    maxAttempts: 3,
    baseDelay: 1000
  }).catch(async (error) => {
    const appError = await errorService.handleError(error, {
      operation: 'startFast',
      userId,
      plannedDuration
    });
    return { id: null, error: appError.userMessage };
  });
};

// Update fast status (pause/resume/etc)
export const updateFastStatus = async (fastId: string, status: Fast['status']) => {
  try {
    console.log('🔄 Database: Updating fast status to:', status);
    
    const fastRef = doc(db, 'fasts', fastId);
    await updateDoc(fastRef, {
      status,
      updatedAt: Timestamp.fromDate(new Date())
    });

    console.log('✅ Database: Fast status updated');
    return { error: null };
  } catch (error: any) {
    console.error('❌ Database: Error updating fast status:', error);
    return { error: error.message };
  }
};

// End a fast
export const endFast = async (fastId: string) => {
  try {
    console.log('🛑 Database: Ending fast:', fastId);
    
    const fastRef = doc(db, 'fasts', fastId);
    const fastDoc = await getDoc(fastRef);
    
    if (!fastDoc.exists()) {
      return { error: 'Fast not found' };
    }

    const fastData = fastDoc.data();
    const startTime = fastData.startTime.toDate();
    const endTime = new Date();
    const actualDuration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // hours

    await updateDoc(fastRef, {
      endTime: Timestamp.fromDate(endTime),
      actualDuration,
      status: 'completed',
      updatedAt: Timestamp.fromDate(new Date())
    });

    console.log('✅ Database: Fast ended successfully');
    return { error: null };
  } catch (error: any) {
    console.error('❌ Database: Error ending fast:', error);
    return { error: error.message };
  }
};

// Add water intake
export const addWaterIntake = async (fastId: string, amount: number, note?: string) => {
  try {
    console.log('💧 Database: Adding water intake:', amount, 'ml');
    
    const fastRef = doc(db, 'fasts', fastId);
    const fastDoc = await getDoc(fastRef);
    
    if (!fastDoc.exists()) {
      return { error: 'Fast not found' };
    }

    const currentData = fastDoc.data();
    const newWaterEntry: WaterEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      amount,
      note
    };

    const updatedWaterIntake = [
      ...(currentData.waterIntake || []),
      {
        ...newWaterEntry,
        timestamp: Timestamp.fromDate(newWaterEntry.timestamp)
      }
    ];

    await updateDoc(fastRef, {
      waterIntake: updatedWaterIntake,
      updatedAt: Timestamp.fromDate(new Date())
    });

    console.log('✅ Database: Water intake added');
    return { error: null };
  } catch (error: any) {
    console.error('❌ Database: Error adding water intake:', error);
    return { error: error.message };
  }
};

// Get user's current active fast (one-time fetch)
export const getCurrentFast = async (userId: string) => {
  try {
    console.log('📥 Database: Getting current fast for user:', userId);
    
    const q = query(
      collection(db, 'fasts'),
      where('userId', '==', userId),
      where('status', 'in', ['active', 'paused']),
      orderBy('startTime', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('🚫 Database: No active fast found');
      return { fast: null, error: null };
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    const fast: Fast = {
      id: doc.id,
      ...data,
      startTime: data.startTime.toDate(),
      endTime: data.endTime ? data.endTime.toDate() : undefined,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      waterIntake: data.waterIntake?.map((entry: any) => ({
        ...entry,
        timestamp: entry.timestamp.toDate()
      })) || []
    };

    console.log('✅ Database: Current fast loaded:', fast.id);
    return { fast, error: null };
  } catch (error: any) {
    console.error('❌ Database: Error getting current fast:', error);
    return { fast: null, error: error.message };
  }
};

// 🔥 NEW: Real-time subscription to current active fast
export const subscribeToCurrentFast = (userId: string, callback: FastListener): UnsubscribeFunction => {
  console.log('📡 Database: Setting up real-time listener for user:', userId);
  
  try {
    const q = query(
      collection(db, 'fasts'),
      where('userId', '==', userId),
      where('status', 'in', ['active', 'paused']),
      orderBy('startTime', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q, 
      (querySnapshot: QuerySnapshot) => {
        console.log('📡 Database: Real-time update received');
        
        if (querySnapshot.empty) {
          console.log('📡 Database: No active fast found in real-time update');
          callback(null);
          return;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        const fast: Fast = {
          id: doc.id,
          ...data,
          startTime: data.startTime.toDate(),
          endTime: data.endTime ? data.endTime.toDate() : undefined,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          waterIntake: data.waterIntake?.map((entry: any) => ({
            ...entry,
            timestamp: entry.timestamp.toDate()
          })) || []
        };

        console.log('📡 Database: Real-time fast data:', {
          id: fast.id,
          status: fast.status,
          waterIntakeCount: fast.waterIntake.length
        });
        
        callback(fast);
      },
      (error) => {
        console.error('❌ Database: Real-time listener error:', error);
        // Don't call callback with error, let the component handle it
      }
    );

    console.log('✅ Database: Real-time listener set up successfully');
    return unsubscribe;
  } catch (error) {
    console.error('❌ Database: Error setting up real-time listener:', error);
    // Return a dummy unsubscribe function
    return () => {};
  }
};

// 🔥 NEW: Subscribe to specific fast by ID (for multi-device sync)
export const subscribeToFast = (fastId: string, callback: FastListener): UnsubscribeFunction => {
  console.log('📡 Database: Setting up real-time listener for fast:', fastId);
  
  try {
    const fastRef = doc(db, 'fasts', fastId);
    
    const unsubscribe = onSnapshot(
      fastRef,
      (doc: DocumentSnapshot) => {
        console.log('📡 Database: Fast-specific real-time update received');
        
        if (!doc.exists()) {
          console.log('📡 Database: Fast no longer exists');
          callback(null);
          return;
        }

        const data = doc.data();
        const fast: Fast = {
          id: doc.id,
          ...data,
          startTime: data?.startTime.toDate(),
          endTime: data?.endTime ? data.endTime.toDate() : undefined,
          createdAt: data?.createdAt.toDate(),
          updatedAt: data?.updatedAt.toDate(),
          waterIntake: data?.waterIntake?.map((entry: any) => ({
            ...entry,
            timestamp: entry.timestamp.toDate()
          })) || []
        };

        console.log('📡 Database: Fast-specific real-time data:', {
          id: fast.id,
          status: fast.status,
          lastUpdated: fast.updatedAt.toISOString()
        });
        
        callback(fast);
      },
      (error) => {
        console.error('❌ Database: Fast-specific real-time listener error:', error);
      }
    );

    console.log('✅ Database: Fast-specific real-time listener set up successfully');
    return unsubscribe;
  } catch (error) {
    console.error('❌ Database: Error setting up fast-specific real-time listener:', error);
    return () => {};
  }
};

// Get user's fast history
export const getFastHistory = async (userId: string) => {
  try {
    console.log('📚 Database: Getting fast history for user:', userId);
    
    const q = query(
      collection(db, 'fasts'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const fasts: Fast[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fasts.push({
        id: doc.id,
        ...data,
        startTime: data.startTime.toDate(),
        endTime: data.endTime ? data.endTime.toDate() : undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        waterIntake: data.waterIntake?.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp.toDate()
        })) || []
      });
    });

    console.log('✅ Database: Fast history loaded:', fasts.length, 'fasts');
    return { fasts, error: null };
  } catch (error: any) {
    console.error('❌ Database: Error getting fast history:', error);
    return { fasts: [], error: error.message };
  }
};

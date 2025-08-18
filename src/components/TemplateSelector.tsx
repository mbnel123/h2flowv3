// src/components/TemplateSelector.tsx
import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, Droplets, Plus, Copy, Trash2, Edit3, Bookmark } from 'lucide-react';
import { FastTemplate, templateService, TemplateStats } from '../services/templateService.ts';

interface TemplateSelectorProps {
  userId: string;
  onSelectTemplate: (template: FastTemplate) => void;
  onClose: () => void;
  selectedDuration?: number;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  userId,
  onSelectTemplate,
  onClose,
  selectedDuration
}) => {
  const [templates, setTemplates] = useState<FastTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<FastTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'custom'>('all');
  const [stats, setStats] = useState<TemplateStats | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FastTemplate | null>(null);

  // Load templates
  useEffect(() => {
    const unsubscribe = templateService.subscribe((updatedTemplates) => {
      setTemplates(updatedTemplates);
      setStats(templateService.getTemplateStats());
    });

    return unsubscribe;
  }, []);

  // Filter templates
  useEffect(() => {
    let filtered = templates;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const searchResults = templateService.searchTemplates(searchQuery);
      filtered = filtered.filter(template => 
        searchResults.some(result => result.id === template.id)
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchQuery]);

  const handleSelectTemplate = (template: FastTemplate) => {
    templateService.useTemplate(template.id);
    onSelectTemplate(template);
    onClose();
  };

  const handleDuplicateTemplate = (template: FastTemplate) => {
    templateService.duplicateTemplate(template.id, userId);
  };

  const handleDeleteTemplate = (template: FastTemplate) => {
    if (confirm(`Delete "${template.name}"?`)) {
      templateService.deleteTemplate(template.id);
    }
  };

  const categories = [
    { key: 'all', label: 'All', count: templates.length },
    { key: 'beginner', label: 'Beginner', count: templates.filter(t => t.category === 'beginner').length },
    { key: 'intermediate', label: 'Intermediate', count: templates.filter(t => t.category === 'intermediate').length },
    { key: 'advanced', label: 'Advanced', count: templates.filter(t => t.category === 'advanced').length },
    { key: 'custom', label: 'Custom', count: templates.filter(t => t.category === 'custom').length }
  ];

  const getDurationColor = (duration: number) => {
    if (duration <= 16) return 'text-green-600 bg-green-50';
    if (duration <= 24) return 'text-blue-600 bg-blue-50';
    if (duration <= 48) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getCategoryBadge = (category: FastTemplate['category']) => {
    const badges = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
      custom: 'bg-purple-100 text-purple-800'
    };
    return badges[category];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Choose Fast Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as any)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${selectedCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalTemplates}</div>
                <div className="text-sm text-gray-600">Total Templates</div>
              </div>
              {stats.mostUsed && (
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.mostUsed.usageCount}</div>
                  <div className="text-sm text-gray-600">Most Used: {stats.mostUsed.name}</div>
                </div>
              )}
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.favoriteCategory}</div>
                <div className="text-sm text-gray-600">Favorite Category</div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-600">No templates found matching your criteria</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Custom Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`
                    border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg
                    ${selectedDuration === template.duration 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleSelectTemplate(template)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{template.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryBadge(template.category)}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-1">
                      {template.isCustom && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTemplate(template);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(template);
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  )}

                  {/* Duration */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getDurationColor(template.duration)}`}>
                    <Clock className="w-4 h-4 mr-1" />
                    {template.duration}h
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    {template.waterGoal && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                        {template.waterGoal}ml water goal
                      </div>
                    )}
                    
                    {template.usageCount > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        Used {template.usageCount} time{template.usageCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {template.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Last used */}
                  {template.lastUsed && (
                    <div className="mt-2 text-xs text-gray-500">
                      Last used: {template.lastUsed.toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Custom Template
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Use current duration as template
                  if (selectedDuration) {
                    const customTemplate: FastTemplate = {
                      id: 'temp_custom',
                      userId: userId,
                      name: `${selectedDuration}h Custom Fast`,
                      icon: '⚡',
                      duration: selectedDuration,
                      category: 'custom',
                      tags: ['custom'],
                      isDefault: false,
                      isCustom: true,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      usageCount: 0
                    };
                    onSelectTemplate(customTemplate);
                    onClose();
                  }
                }}
                disabled={!selectedDuration}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Use Current ({selectedDuration}h)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;

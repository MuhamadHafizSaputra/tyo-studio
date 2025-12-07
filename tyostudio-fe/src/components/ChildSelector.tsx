"use client";

import React from 'react';

interface Child {
    id: string;
    name: string;
}

interface ChildSelectorProps {
    childrenData: Child[];
    selectedId: string;
    onSelect: (childId: string) => void;
    label?: string;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({
    childrenData,
    selectedId,
    onSelect,
    label = "Pilih Anak"
}) => {
    if (!childrenData || childrenData.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <select
                    value={selectedId || ''}
                    onChange={(e) => onSelect(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="" disabled>-- Pilih Data Anak --</option>
                    {childrenData.map((child) => (
                        <option key={child.id} value={child.id}>
                            {child.name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                    ▼
                </div>
            </div>
        </div>
    );
};

export default ChildSelector;

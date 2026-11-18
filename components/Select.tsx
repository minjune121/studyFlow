'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  name?: string;
}

const SIZE_STYLES = {
  sm: 'py-1.5 px-3 text-[12px]',
  md: 'py-2 px-3.5 text-[13px]',
  lg: 'py-2.5 px-4 text-[14px]',
};

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = '선택하세요',
  label,
  error,
  helperText,
  disabled = false,
  size = 'md',
  className = '',
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(
    value !== undefined ? value : defaultValue || ''
  );
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        const option = options[highlightedIndex];
        if (!option.disabled) {
          handleSelect(option.value);
        }
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < options.length && options[next].disabled) {
            next++;
          }
          return next < options.length ? next : prev;
        });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next].disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
      }
    }
  };

  const handleSelect = (val: string) => {
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={generatedId}
          className="text-[12px] font-semibold text-on-surface"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={generatedId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full flex items-center justify-between text-left rounded-[8px] border transition-colors focus:outline-none ${
            SIZE_STYLES[size]
          } ${
            disabled
              ? 'bg-surface-low text-outline cursor-not-allowed border-outline-variant/30'
              : error
              ? 'bg-white border-error text-on-surface focus:ring-1 focus:ring-error'
              : isOpen
              ? 'bg-white border-primary ring-1 ring-primary text-on-surface'
              : 'bg-white border-[#eff4ff] text-on-surface hover:border-outline-variant/60'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption?.icon && (
              <span className="flex-shrink-0 text-on-surface-variant">
                {selectedOption.icon}
              </span>
            )}
            <span
              className={`truncate ${
                !selectedOption ? 'text-outline font-normal' : 'font-medium'
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <ChevronDown
            className={`w-4 h-4 ml-2 flex-shrink-0 text-outline transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className="absolute z-40 w-full mt-1.5 py-1 bg-white border border-[#eff4ff] rounded-[8px] shadow-dropdown max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
          >
            {options.length === 0 ? (
              <li className="px-3.5 py-2 text-[13px] text-outline text-center">
                선택 항목이 없습니다.
              </li>
            ) : (
              options.map((option, idx) => {
                const isSelected = option.value === selectedValue;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => {
                      if (!option.disabled) {
                        handleSelect(option.value);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors text-[13px] ${
                      option.disabled
                        ? 'opacity-40 cursor-not-allowed bg-transparent'
                        : isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : isHighlighted
                        ? 'bg-surface-low text-on-surface'
                        : 'text-on-surface hover:bg-surface-low'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant font-medium">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {/* Hidden input for form submission */}
      {name && (
        <input type="hidden" name={name} value={selectedValue || ''} />
      )}

      {/* Helper / Error Text */}
      {(error || helperText) && (
        <p
          className={`text-[11px] font-medium mt-0.5 ${
            error ? 'text-error' : 'text-on-surface-variant'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default Select;

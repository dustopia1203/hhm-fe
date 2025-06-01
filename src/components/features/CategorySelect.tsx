import { useEffect, useRef, useState } from 'react';
import { useGetCategoryTreeById, useSearchCategories } from "@apis/useCategoryApis.ts";
import { Control, Controller } from "react-hook-form";
import { FiChevronDown, FiChevronRight, FiFile, FiFolder } from "react-icons/fi";
import Loader from "@components/common/Loader.tsx";

interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

interface CategorySelectProps {
  name: string;
  control: Control<any>;
  error?: string;
  disabled?: boolean;
}

function CategorySelect({ name, control, error, disabled }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: rootData, isLoading: isLoadingRoots } = useSearchCategories({
    status: "ACTIVE"
  });

  const { data: subCategoriesData, isLoading: isLoadingSubCategories } = useGetCategoryTreeById(
    hoveredCategory || "",
    { enabled: !!hoveredCategory }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLeafCategory = (category: Category): boolean => {
    return !category.subCategories || category.subCategories.length === 0;
  };

  const handleSelectCategory = (category: Category, onChange: (value: string) => void) => {
    if (isLeafCategory(category)) {
      setSelectedCategory(category);
      onChange(category.id);
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-400 mb-2">Danh mục</label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer flex justify-between items-center"
              onClick={() => !disabled && setIsOpen(!isOpen)}
            >
              <span>{selectedCategory ? selectedCategory.name : "-- Chọn danh mục --"}</span>
              <FiChevronDown className="ml-2" />
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            {isOpen && (
              <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                <div className="grid grid-cols-2 h-[320px]">
                  {/* Left panel - Root categories */}
                  <div className="border-r border-gray-600 overflow-y-auto">
                    {isLoadingRoots ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader />
                      </div>
                    ) : (
                      <ul className="py-2">
                        {rootData?.data?.map((category: Category) => (
                          <li
                            key={category.id}
                            className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center ${
                              hoveredCategory === category.id ? 'bg-gray-700' : ''
                            }`}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                          >
                            {isLeafCategory(category) ? (
                              <FiFile className="mr-2 text-blue-500" />
                            ) : (
                              <FiFolder className="mr-2 text-yellow-500" />
                            )}
                            <span>{category.name}</span>
                            {!isLeafCategory(category) && <FiChevronRight className="ml-auto" />}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Right panel - Subcategories */}
                  <div className="overflow-y-auto">
                    {isLoadingSubCategories ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader />
                      </div>
                    ) : hoveredCategory && subCategoriesData ? (
                      <div className="py-2">
                        {renderCategoryTree(subCategoriesData.data, field.onChange, handleSelectCategory)}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full text-gray-500">
                        Chọn danh mục để xem danh mục con
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Hidden input for form value */}
            <input type="hidden" value={field.value || ""} />
          </div>
        )}
      />
    </div>
  );
}

// Recursive function to render category tree
function renderCategoryTree(
  category: Category,
  onChange: (value: string) => void,
  onSelect: (category: Category, onChange: (value: string) => void) => void
) {
  // If this is a leaf category, it's selectable
  const isLeaf = !category.subCategories || category.subCategories.length === 0;

  return (
    <div key={category.id} className="mb-1">
      <div
        className={`px-4 py-1 ${isLeaf ? 'hover:bg-gray-700 cursor-pointer' : 'font-semibold'} flex items-center`}
        onClick={() => isLeaf && onSelect(category, onChange)}
      >
        {isLeaf ? (
          <FiFile className="mr-2 text-blue-500" />
        ) : (
          <FiFolder className="mr-2 text-yellow-500" />
        )}
        <span className={isLeaf ? 'text-blue-400' : 'text-gray-300'}>{category.name}</span>
      </div>

      {category.subCategories && category.subCategories.length > 0 && (
        <div className="pl-4">
          {category.subCategories.map(child => renderCategoryTree(child, onChange, onSelect))}
        </div>
      )}
    </div>
  );
}

export default CategorySelect;

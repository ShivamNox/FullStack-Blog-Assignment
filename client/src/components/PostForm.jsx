import { useState, useEffect } from 'react';

const initialFormState = {
  title: '',
  imageURL: '',
  content: ''
};

export default function PostForm({ initialData, onSubmit, isLoading, submitText = 'Submit' }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        imageURL: initialData.imageURL || '',
        content: initialData.content || ''
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters';
    }

    if (formData.imageURL.trim()) {
      try {
        new URL(formData.imageURL);
      } catch {
        newErrors.imageURL = 'Please enter a valid URL';
      }
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = `Content must be at least 50 characters (${formData.content.length}/50)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const submitData = {
      ...formData,
      imageURL: formData.imageURL.trim() || undefined
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'input-error' : ''}`}
          placeholder="Enter a compelling title..."
          maxLength={120}
        />
        <div className="flex justify-between mt-1">
          {errors.title && <p className="error-text">{errors.title}</p>}
          <span className="text-xs text-gray-400 ml-auto">
            {formData.title.length}/120
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="imageURL" className="label">
          Image URL <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="url"
          id="imageURL"
          name="imageURL"
          value={formData.imageURL}
          onChange={handleChange}
          className={`input ${errors.imageURL ? 'input-error' : ''}`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageURL && <p className="error-text">{errors.imageURL}</p>}
        {formData.imageURL && !errors.imageURL && (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={formData.imageURL}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="content" className="label">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className={`input min-h-[200px] resize-y ${errors.content ? 'input-error' : ''}`}
          placeholder="Write your blog post content here (minimum 50 characters)..."
        />
        <div className="flex justify-between mt-1">
          {errors.content && <p className="error-text">{errors.content}</p>}
          <span className={`text-xs ml-auto ${formData.content.length < 50 ? 'text-red-400' : 'text-gray-400'}`}>
            {formData.content.length}/50 min
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 text-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          submitText
        )}
      </button>
    </form>
  );
}
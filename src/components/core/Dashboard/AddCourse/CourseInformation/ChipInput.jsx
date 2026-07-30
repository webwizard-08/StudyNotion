import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  trigger,
}) {
  const { editCourse, course } = useSelector((state) => state.course);

  const [chips, setChips] = useState([]);

  // Load tags while editing
  useEffect(() => {
    if (editCourse && course?.tag) {
      if (Array.isArray(course.tag)) {
        setChips(course.tag);
      } else if (typeof course.tag === "string") {
        setChips(
          course.tag
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        );
      } else {
        setChips([]);
      }
    }
  }, [editCourse, course]);

  // Register field
  useEffect(() => {
    register(name, {
      required: "Tags are required",
      validate: (value) =>
        Array.isArray(value) && value.length > 0,
    });
  }, [register, name]);

  // Update React Hook Form
  useEffect(() => {
    setValue(name, chips, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (trigger) {
      trigger(name);
    }
  }, [chips, name, setValue, trigger]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const value = e.target.value.trim();

      if (!value) return;

      if (chips.includes(value)) {
        e.target.value = "";
        return;
      }

      setChips((prev) => [...prev, value]);

      e.target.value = "";
    }
  };

  const deleteChip = (index) => {
    setChips((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">
        {label}
        <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-wrap gap-2">

        {Array.isArray(chips) &&
          chips.map((chip, index) => (
            <div
              key={index}
              className="flex items-center rounded-full bg-yellow-400 px-3 py-1 text-richblack-900"
            >
              <span>{chip}</span>

              <button
                type="button"
                onClick={() => deleteChip(index)}
                className="ml-2"
              >
                <MdClose />
              </button>
            </div>
          ))}

        <input
          type="text"
          id={name}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-200">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}
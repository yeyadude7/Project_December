import React, { useState } from "react";
import { ArrowLeft, Plus, X, School, Clock, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AddEvent = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    basicInfo: {
      name: "",
      status: "",
      bio: "",
    },
    university: {
      name: "",
      major: "",
      graduationYear: "",
    },
    schedule: [{ days: "", classes: [""] }],
    interests: [{ name: "", emoji: "" }],
    clubs: [{ name: "", role: "" }],
    social: {
      instagram: "",
      linkedin: "",
    },
  });

  const handleBasicInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }));
  };

  const handleScheduleChange = (dayIndex, classIndex, value) => {
    const newSchedule = [...formData.schedule];
    if (classIndex === undefined) {
      newSchedule[dayIndex].days = value;
    } else {
      newSchedule[dayIndex].classes[classIndex] = value;
    }
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const addClassToDay = (dayIndex) => {
    const newSchedule = [...formData.schedule];
    newSchedule[dayIndex].classes.push("");
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const removeClassFromDay = (dayIndex, classIndex) => {
    const newSchedule = [...formData.schedule];
    newSchedule[dayIndex].classes = newSchedule[dayIndex].classes.filter(
      (_, i) => i !== classIndex
    );
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const addScheduleDay = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { days: "", classes: [""] }],
    }));
  };

  const handleInterestChange = (index, field, value) => {
    const newInterests = [...formData.interests];
    newInterests[index] = { ...newInterests[index], [field]: value };
    setFormData((prev) => ({ ...prev, interests: newInterests }));
  };

  const addInterest = () => {
    setFormData((prev) => ({
      ...prev,
      interests: [...prev.interests, { name: "", emoji: "" }],
    }));
  };

  return (
    <div className="grid grid-cols-1 justify-items-center">
      

      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
      >
        {/* Header */}
        <div className=" flex items-center justify-between mb-8">
          <div className="text-gray-500 text-sm">Create Event</div>
          <Link to= "/events">
          <button
            // onClick={onBack}
            className="text-blue-500 flex items-center gap-1 text-sm hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Cancel
          </button>
          </Link>
        </div>

        {/* Basic Info Section */}
        <div className="space-y-4">
          <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 text-sm">
            EVENT INFORMATION
          </div>

          <div className="space-y-4 px-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={formData.basicInfo.name}
                onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Description
              </label>
              <textarea
                value={formData.basicInfo.bio}
                onChange={(e) => handleBasicInfoChange("bio", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Link
              </label>
              <input
                type="text"
                value={formData.basicInfo.name}
                onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Import event photo
              </label>
              <input
                type="text"
                value={formData.basicInfo.name}
                onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>

          </div>
        </div>

        {/* Interests Section */}
        <div className="space-y-4">
          <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 flex items-center gap-2">
            <Heart size={18} />
            <span className="text-sm">INTERESTS</span>
          </div>

          <div className="px-6 space-y-4">
            {formData.interests.map((interest, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                
                <div className="col-span-2">
                  <input
                    type="text"
                    value={interest.name}
                    onChange={(e) =>
                      handleInterestChange(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Interest name"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addInterest}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              Add Interest
            </button>
          </div>
        </div>


        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white pt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;

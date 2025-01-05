import React, { useState } from "react";
import { ArrowLeft, Plus, X, School, Clock, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileEditor = ({ onBack, onSave }) => {
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
          <div className="text-gray-500 text-sm">Edit Profile</div>
          <Link to= "/mainprofile">
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
            BASIC INFORMATION
          </div>

          <div className="space-y-4 px-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.basicInfo.name}
                onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                value={formData.basicInfo.status}
                onChange={(e) =>
                  handleBasicInfoChange("status", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Student Life"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.basicInfo.bio}
                onChange={(e) => handleBasicInfoChange("bio", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        </div>

        {/* University Section */}
        <div className="space-y-4">
          <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 flex items-center gap-2">
            <School size={18} />
            <span className="text-sm">UNIVERSITY</span>
          </div>

          <div className="space-y-4 px-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University Name
              </label>
              <input
                type="text"
                value={formData.university.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    university: { ...prev.university, name: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Stanford University"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={formData.university.major}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      university: { ...prev.university, major: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Year
                </label>
                <input
                  type="text"
                  value={formData.university.graduationYear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      university: {
                        ...prev.university,
                        graduationYear: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 2025"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 flex items-center gap-2">
            <Clock size={18} />
            <span className="text-sm">CLASS SCHEDULE</span>
          </div>

          <div className="px-6 space-y-4">
            {formData.schedule.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-2">
                <input
                  type="text"
                  value={day.days}
                  onChange={(e) =>
                    handleScheduleChange(dayIndex, undefined, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Monday & Wednesday"
                />

                {day.classes.map((classInfo, classIndex) => (
                  <div key={classIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={classInfo}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayIndex,
                          classIndex,
                          e.target.value
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. CS246: Deep Learning - 9:00 AM"
                    />
                    <button
                      type="button"
                      onClick={() => removeClassFromDay(dayIndex, classIndex)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addClassToDay(dayIndex)}
                  className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-600"
                >
                  <Plus size={16} /> Add Class
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addScheduleDay}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              Add Day
            </button>
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
                <div className="col-span-1">
                  <input
                    type="text"
                    value={interest.emoji}
                    onChange={(e) =>
                      handleInterestChange(index, "emoji", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="🤖"
                  />
                </div>
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

        {/* Social Media Section */}
        <div className="space-y-4">
          <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 text-sm">
            SOCIAL MEDIA
          </div>

          <div className="space-y-4 px-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.social.instagram}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    social: { ...prev.social, instagram: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="text"
                value={formData.social.linkedin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    social: { ...prev.social, linkedin: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="linkedin.com/in/username"
              />
            </div>
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

export default ProfileEditor;

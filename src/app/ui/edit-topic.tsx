'use client'

import { useState, useEffect, useActionState } from 'react';
import { LuUpload, LuX } from 'react-icons/lu';
import { editTopicPost } from '@/../lib/topics-server-actions';
import { TopicPostValidationErrors, Topic } from '@/../lib/utils/topics-validation';
import Link from 'next/link'
import { User } from 'better-auth';
import { useRouter } from 'next/navigation';

export default function CreateTopic({ userData, postTopic }: { userData: User, postTopic: Topic }) {

    const [validationErrors, setValidationErrors] = useState<TopicPostValidationErrors | null>(null);
    const [postFailedError, setPostFailedError] = useState<string | undefined>("");
    const [title, setTitle] = useState(postTopic.title);
    const [content, setContent] = useState(postTopic.content);
    // const [mediaPreview, setMediaPreview] = useState(null);
    // const [mediaFile, setMediaFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // const handleImageUpload = (e) => {
    //   const file = e.target.files[0];
    //   if (file && file.type.startsWith('image/')) {
    //     setMediaFile(file);
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       setMediaPreview(reader.result);
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // };

    // const removeMedia = () => {
    //   setMediaPreview(null);
    //   setMediaFile(null);
    // };
    const editTopicPostBindId = editTopicPost.bind(null, postTopic._id);
    const [result, editTopicFormAction, isPending] = useActionState(editTopicPostBindId, null);

    const router = useRouter();

    useEffect(() => {

        if (result && !result.success) {

            // Server sided errors
            if (result.apiError) {
                setPostFailedError(result.apiError);
            }

            // Client sided errors
            else if (result.validationErrors) {
                setValidationErrors({
                    title: result.validationErrors.title,
                    content: result.validationErrors.content
                });
                setPostFailedError(result.message);
            }
        }
    }, [result])

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-slate-800 text-white p-4">
                    <h1 className="text-2xl font-bold">Edit Post</h1>
                </div>

                {/* Content */}
                <form action={editTopicFormAction} className="space-y-3">
                    <div className="p-6 space-y-6">
                        {/* Post Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Post Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a catchy title for your post"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all text-gray-700"
                            />
                        </div>

                        {/* Post Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none resize-none transition-all text-gray-700"
                            />
                            <p className="text-sm text-gray-500 mt-1">{content.length} characters</p>
                        </div>

                        {/* Media Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Media (Optional)
                            </label>

                            {/* {!mediaPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    id="media-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="media-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <LuUpload className="text-gray-400 mb-3" size={48} />
                    <span className="text-sm text-gray-600 mb-1">Click to upload an image</span>
                    <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <LuX size={20} />
                  </button>
                </div>
              )} */}
                        </div>

                        {/* Post Preview Info TODO: Implement as separate component later*/}
                        {/* <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Post Preview Info</h3>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{userData.name}</span>
                <span className="mx-2">•</span>
                <h2>{title}</h2>
                <p>{content}</p>
              </div>
            </div> */}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel Edit
                            </button>
                            <button
                                type="submit"
                                //onClick={handleSubmit}
                                // disabled={!isFormValid || isSubmitting}
                                className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isSubmitting ? 'Editing...' : 'Edit Post'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
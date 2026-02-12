"use client";

import { useState, useEffect, useActionState } from "react";
import { LuUpload, LuX } from "react-icons/lu";
import { editTopicPost } from "@/app/lib/topics-server-actions";
import { TopicPostErrors, Topic } from "@/app/lib/utils/topics-validation";
import Link from "next/link";
import { UserData } from "@/types/user-interfaces";
import { useRouter } from "next/navigation";

export default function CreateTopic({
    userData,
    postTopic,
}: {
    userData: UserData;
    postTopic: Topic;
}) {
    const [editPostErrors, setEditPostErrors] =
        useState<TopicPostErrors | null>(null);

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
    const [result, editTopicFormAction, isPending] = useActionState(
        editTopicPostBindId,
        null,
    );

    const router = useRouter();

    useEffect(() => {
        if (result) {
            if (!result.success) {
                // Client sided errors
                if (result.validationErrors) {
                    setEditPostErrors({
                        title: result.validationErrors.title,
                        content: result.validationErrors.content,
                    });
                }
            } else {
                setEditPostErrors({
                    title: undefined,
                    content: undefined,
                });
            }
        }
    }, [result]);

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="mx-auto max-w-4xl p-4">
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                {/* Header */}
                <div className="bg-slate-800 p-4 text-white">
                    <h1 className="text-2xl font-bold">Edit Post</h1>
                </div>

                {/* Content */}
                <form action={editTopicFormAction} className="space-y-3">
                    <div className="space-y-6 p-6">
                        {/* Post Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Post Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a catchy title for your post"
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-slate-500"
                                aria-describedby="edit-post-title-error"
                            />
                        </div>
                        {editPostErrors?.title &&
                            editPostErrors.title.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}

                        {/* Post Content */}
                        <div>
                            <label
                                htmlFor="content"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                rows={6}
                                className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-slate-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {content.length} characters
                            </p>
                        </div>
                        {editPostErrors?.content &&
                            editPostErrors.content.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}

                        {/* Media Upload */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
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
                        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                            <button
                                onClick={handleCancel}
                                className="rounded-md border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel Edit
                            </button>
                            <button
                                type="submit"
                                //onClick={handleSubmit}
                                // disabled={!isFormValid || isSubmitting}
                                className="rounded-md bg-slate-800 px-6 py-2 font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {isSubmitting ? "Editing..." : "Edit Post"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

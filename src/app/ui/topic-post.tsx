'use client'

import { useState, useEffect, useActionState } from 'react';
import { LuThumbsUp, LuThumbsDown, LuEllipsisVertical, LuSquarePen, LuTrash2, LuSend, LuPencilLine, LuArrowLeft } from 'react-icons/lu';
import Link from 'next/link'
import { User } from 'better-auth';
import { Topic, TopicComment, PostTopicCommentValidationErrors } from '@/../lib/utils/topics-validation';
import { addCommentToTopicPost } from '@/../lib/topics-server-actions';

export default function TopicPost({ userData, postTopic, postTopicComments }: { userData: User, postTopic: Topic, postTopicComments?: TopicComment[] }) {
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [showCommentMenu, setShowCommentMenu] = useState({});
    const [postLikes, setPostLikes] = useState(24);
    const [postDislikes, setPostDislikes] = useState(3);
    const [newComment, setNewComment] = useState('');

    const [validationErrors, setValidationErrors] = useState<PostTopicCommentValidationErrors | null>(null);
    const [postCommentsFailedError, setPostCommentsFailedError] = useState<string | undefined>("");
    const commentTopicPostWithId = addCommentToTopicPost.bind(null, postTopic._id);
    const [result, createTopicFormAction, isPending] = useActionState(commentTopicPostWithId, null);
    const currentUser = userData.id;


    const toggleCommentMenu = (id: string) => {
        // setShowCommentMenu(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        if (result && !result.success) {

            // Server sided errors
            if (result.apiError) {
                setPostCommentsFailedError(result.apiError);
            }

            // Client sided errors
            else if (result.validationErrors) {
                setValidationErrors({
                    content: result.validationErrors.content,
                });
                setPostCommentsFailedError(result.message);
            }
        }
    }, [result])

    const handleLikeComment = (id: string) => {

    };

    const handleDislikeComment = (id: string) => {
        // setComments(comments.map(c => 
        //   c.id === id ? { ...c, dislikes: c.dislikes + 1 } : c
        // ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Navigation */}
            <div className="bg-slate-800 text-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <Link
                        href="/dashboard/topics-board"
                        className="flex text-nowrap w-min justify-center gap-4 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                        >
                        <LuArrowLeft className="mt-0.5 ml-auto h-5 w-5 text-gray-50" />
                        Back to topics
                        </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Post Content - Main Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Post Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Post Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{postTopic.title}</h1>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium text-lg">{postTopic.username}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(postTopic.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>

                                    {/* Post Menu (Only for owner) */}
                                    {postTopic.userId === userData.id && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowPostMenu(!showPostMenu)}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <LuEllipsisVertical size={20} className="text-gray-600" />
                                            </button>

                                            {showPostMenu && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                                        <LuSquarePen size={16} />
                                                        <span>Edit Post</span>
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600">
                                                        <LuTrash2 size={16} />
                                                        <span>Delete Post</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Media Content */}
                            {/* <div className="w-full">
                                <img
                                    // TODO: Replace with postTopic.mediaUrl when media upload is implemented
                                    src={post.mediaUrl}
                                    alt={postTopic.title}
                                    className="w-full h-96 object-cover"
                                />
                            </div> */}

                            {/* Post Content & Actions */}
                            <div className="p-6">
                                <p className="text-gray-800 text-lg leading-relaxed mb-6">{postTopic.content}</p>

                                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setPostLikes(postTopic.likes + 1)}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <LuThumbsUp size={24} />
                                        <span className="font-medium text-lg">{postTopic.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => setPostDislikes(postTopic.dislikes + 1)}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        <LuThumbsDown size={24} />
                                        <span className="font-medium text-lg">{postTopic.dislikes}</span>
                                    </button>
                                    {postTopicComments && <div className="text-gray-600">
                                        <span className="font-medium">{postTopicComments.length}</span> Comments
                                    </div>}
                                </div>
                            </div>
                        </div>

                        {/* Add Comment Section */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <form action={createTopicFormAction}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Add a Comment</h3>
                                <div className="flex space-x-3">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        rows={3}
                                        name="content"
                                        id="content"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none resize-none transition-all  text-gray-900"
                                    />
                                </div>
                                <div className="flex justify-end mt-3">
                                    <button
                                        disabled={!newComment.trim()}
                                        className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <LuSend size={18} />
                                        <span>Post Comment</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Comments Section */}
                        {postTopicComments && <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({postTopicComments.length})</h3>

                            <div className="space-y-6">
                                {postTopicComments.map((comment) => (
                                    <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-semibold text-gray-900 text-base">{comment.username}</span>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(postTopic.createdAt).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                            })}</span>
                                            </div>

                                            {/* Comment Menu (Only for owner) */}
                                            {comment.userId === userData.id && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => toggleCommentMenu(comment.userId)}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                    >
                                                        <LuEllipsisVertical size={16} className="text-gray-600" />
                                                    </button>

                                                    {showCommentMenu[comment.id] && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                                                <LuSquarePen size={14} />
                                                                <span className="text-sm">Edit Comment</span>
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600">
                                                                <LuTrash2 size={14} />
                                                                <span className="text-sm">Delete Comment</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-800 mb-3 leading-relaxed">{comment.content}</p>

                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleLikeComment(comment.userId)}
                                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                                            >
                                                <LuThumbsUp size={18} />
                                                <span className="font-medium">{comment.likes}</span>
                                            </button>
                                            <button
                                                onClick={() => handleDislikeComment(comment.userId)}
                                                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                                            >
                                                <LuThumbsDown size={18} />
                                                <span className="font-medium">{comment.dislikes}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div>

                    {/* Sidebar - Related Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Post Information</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Published:</span>
                                    <p className="font-medium text-gray-900">{new Date().toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Author:</span>
                                    <p className="font-medium text-gray-900">{postTopic.username}</p>
                                </div>
                                {postTopicComments && <div>
                                    <span className="text-gray-600">Comments:</span>
                                    <p className="font-medium text-gray-900">{postTopicComments.length} comments</p>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
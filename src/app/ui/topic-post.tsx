'use client'

import { useState, useRef, useEffect, useActionState } from 'react';
import { LuThumbsUp, LuThumbsDown, LuEllipsisVertical, LuSquarePen, LuTrash2, LuSend, LuArrowLeft } from 'react-icons/lu';
import Link from 'next/link'
import { UserData } from '@/types/user-interfaces'
import { Topic, TopicComment, TopicPostCommentErrors } from '@/app/lib/utils/topics-validation';
import {
    addCommentToTopicPost,
    editTopicPostComment,
    updateTopicPostCommentReactions,
    updateTopicPostReactions,
    deleteTopicPost,
    deleteTopicPostComment
} from '@/app/lib/topics-server-actions';
import { useClickOutsideSingle, useClickOutsideMap } from './utils/ui-utils';
import { useRouter } from 'next/navigation';
import { SimpleModal } from './simple-modal';

export default function TopicPost({ userData, postTopic, postTopicComments }: { userData: UserData, postTopic: Topic, postTopicComments?: TopicComment[] }) {
    const [showPostMenu, setShowPostMenu] = useState(false);

    const [commentMenuId, setCommentMenuId] = useState("");
    const [showCommentMenu, setShowCommentMenu] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [editedComment, setEditedComment] = useState('');
    const [commentToUpdateId, setCommentToUpdateId] = useState(' ');

    const [createCommentsError, setCreateCommentsError] = useState<TopicPostCommentErrors | null>(null);
    const [editCommentsError, setEditCommentsError] = useState<TopicPostCommentErrors | null>(null);

    const [isEditingComment, setIsEditingComment] = useState(false);

    const commentTopicPostBindId = addCommentToTopicPost.bind(null, postTopic._id);
    const [createCommentResult, createCommentFormAction, isCreationPending] = useActionState(commentTopicPostBindId, null);

    const bindedEditTopicComment = editTopicPostComment.bind(null, commentToUpdateId);
    const [editCommentResult, editCommentFormAction, isEditingPending] = useActionState(bindedEditTopicComment, null);

    const [contextPostId, setContextPostId] = useState("");     // To be used for post deletion or comment reference
    const [showPostConfirmDeletionModal, setShowPostConfirmDeletionModal] = useState(false);

    const [commentIdToDelete, setCommentIdToDelete] = useState("");
    const [showCommentConfirmDeletionModal, setShowCommentConfirmDeletionModal] = useState(false);

    const router = useRouter();

    const openPostDeletionModal = (id: string) => {
        setContextPostId(id);
        setShowPostConfirmDeletionModal(true);
    }

    const handlePostDeletion = async () => {
        await deleteTopicPost(contextPostId);
        setContextPostId("");
        setShowPostConfirmDeletionModal(false);
        router.push('/dashboard/topics-board');
    }

    const openCommentDeletionModal = (postId: string, commentId: string) => {
        setContextPostId(postId);
        setCommentIdToDelete(commentId);
        setShowCommentConfirmDeletionModal(true);
    }

    const handleCommentDeletion = async () => {
        await deleteTopicPostComment(contextPostId, commentIdToDelete);

        setContextPostId("");
        setCommentIdToDelete("");
        setShowCommentConfirmDeletionModal(false);
    }

    useEffect(() => {
        if (createCommentResult) {

            if(!createCommentResult.success) {
                // Validation errors
                if (createCommentResult.validationErrors) {
                    setCreateCommentsError({
                        content: createCommentResult.validationErrors.content
                    });
                } 
                // BE errors
                else if(createCommentResult.message) {
                    let parsedMsg: string[] = [createCommentResult.message];
                    
                    setCreateCommentsError({
                        content: parsedMsg
                    });
                }
            }
            else {
                setNewComment("");
                setCreateCommentsError(null);
            }
        }
    }, [createCommentResult]);

    useEffect(() => {
        if (editCommentResult) {
            if(!editCommentResult.success) {
                // Validation errors
                if (editCommentResult.validationErrors) {
                    setEditCommentsError(editCommentResult.validationErrors);
                }
                // BE errors
                else if(editCommentResult.message) {
                    let parsedMsg: string[] = [editCommentResult.message] ;
                    
                    setEditCommentsError({
                        content: parsedMsg
                    });
                }
            }
            else {
                handleCancelEditing();
            }
        }
    }, [editCommentResult]);

    const menuRef = useRef<HTMLDivElement>(null);   // The dropdown menu for post
    useClickOutsideSingle(menuRef, () => { setShowPostMenu(false); });

    const commentsMenuButtonRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
    function getCommentsMenuButtonRefMap() {
        if (!commentsMenuButtonRefs.current) {
            commentsMenuButtonRefs.current = new Map<string, HTMLDivElement | null>();
        }
        return commentsMenuButtonRefs.current;
    }
    useClickOutsideMap(commentsMenuButtonRefs, commentMenuId, () => {
        setShowCommentMenu(false);

        if (!isEditingComment) {
            setCommentMenuId("");
        }
    })

    const toggleCommentMenu = (id: string) => {
        setCommentMenuId(prevId => prevId === id ? "" : id);
        setShowCommentMenu(!showCommentMenu);
        setCommentToUpdateId(id);
    };

    const handlePostReaction = async (id: string, reactionType: 'like' | 'dislike') => {
        await updateTopicPostReactions(id, reactionType);
    }

    const handleCommentReaction = async (id: string, reactionType: 'like' | 'dislike') => {
        await updateTopicPostCommentReactions(id, reactionType);
    }

    const handleEditingComment = () => {
        setShowCommentMenu(false);
        setIsEditingComment(true);
    }

    const handleCancelEditing = () => {
        setIsEditingComment(false);
        setEditedComment("");
        setCommentToUpdateId("");
        setCommentMenuId("");
        setEditCommentsError(null);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Navigation */}
            <div className="bg-slate-800 text-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <Link
                        href="/dashboard/topics-board"
                        className="flex text-nowrap w-min justify-center self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        <LuArrowLeft className="mt-0.5 ml-auto h-5 w-5 text-gray-50" />
                        Back to topics
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Post Content - Main Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Post Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Post Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start text-gray-900">
                                    
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <h1 className="text-3xl font-bold break-all min-w-0 flex-1">{postTopic.title}</h1>
                                        {/* Post Menu (Only for owner) */}
                                        {postTopic.userId === userData.id && (
                                            <div ref={menuRef} className="relative">
                                                <button
                                                    onClick={() => setShowPostMenu(!showPostMenu)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <LuEllipsisVertical size={20} className="text-gray-600" />
                                                </button>

                                                {showPostMenu && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                        <Link
                                                            className="w-full text-left px-4 py-2 hover:bg-blue-100 flex items-center space-x-2"
                                                            href={`/dashboard/topics-board/edit-topic/${postTopic._id}`}
                                                        >
                                                            <LuSquarePen className="stroke-black" size={14} />
                                                            <span className="text-sm text-black">Edit Post</span>
                                                        </Link>
                                                        <button
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                                                            onClick={() => openPostDeletionModal(postTopic._id)}
                                                        >
                                                            <LuTrash2 size={16} />
                                                            <span className="text-sm">Delete Post</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    
                                </div>
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
                                        onClick={() => handlePostReaction(postTopic._id, 'like')}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <LuThumbsUp size={24} />
                                        <span className="font-medium text-lg">{postTopic.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => handlePostReaction(postTopic._id, 'dislike')}
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
                            <form action={createCommentFormAction}>
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
                                        aria-describedby='create-comment-error'
                                    />
                                </div>
                                <div id="create-comment-error" aria-live="polite" aria-atomic="true">
                                    {createCommentsError?.content && createCommentsError.content.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
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
                                                <div ref={(node) => {
                                                    const map = getCommentsMenuButtonRefMap();
                                                    map.set(comment._id, node);

                                                    return () => { map.delete(comment._id); };
                                                }} className="relative">
                                                    {!isEditingComment && <button
                                                        onClick={() => toggleCommentMenu(comment._id)}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                    >
                                                        <LuEllipsisVertical size={16} className="text-gray-600" />
                                                    </button>}

                                                    {commentMenuId === comment._id && showCommentMenu && !isEditingComment && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                            <button
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                                                                onClick={() => handleEditingComment()}
                                                            >
                                                                <LuSquarePen className="stroke-black" size={14} />
                                                                <span className="text-sm  text-black">Edit Comment</span>
                                                            </button>
                                                            <button
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                                                                onClick={() => openCommentDeletionModal(postTopic._id, comment._id)}
                                                            >
                                                                <LuTrash2 size={14} />
                                                                <span className="text-sm  text-black">Delete Comment</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {commentMenuId === comment._id && isEditingComment ?
                                            <div className="flex space-x-4">
                                                <form action={editCommentFormAction} className="w-full flex flex-col" >
                                                    <textarea
                                                        value={editedComment}
                                                        onChange={(e) => setEditedComment(e.target.value)}
                                                        placeholder="Share your thoughts..."
                                                        rows={3}
                                                        name="content"
                                                        id="content"
                                                        className="px-4 py-4 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none resize-none transition-all  text-gray-900"
                                                        aria-describedby='edit-comment-error'
                                                    />
                                                    <div className="flex flex-row justify-between">
                                                        <div id="edit-comment-error" aria-live="polite" aria-atomic="true">
                                                            {editCommentsError?.content && editCommentsError.content.map((error: string) => (
                                                                <p className="mt-2 text-sm text-red-500" key={error}>
                                                                    {error}
                                                                </p>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-end gap-x-8">
                                                            <button type="button" onClick={() => handleCancelEditing()} className="self-end flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">
                                                                Cancel
                                                            </button>

                                                            <button type="submit" className="self-end flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-slate-700 transition-colors">
                                                                <LuSquarePen className="stroke-white" size={14} />
                                                                <span className="text-md text-white">Edit Comment</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div> :
                                            <p className="text-gray-800 mb-3 leading-relaxed">{comment.content}</p>
                                        }

                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleCommentReaction(comment._id, 'like')}
                                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                                            >
                                                <LuThumbsUp size={18} />
                                                <span className="font-medium">{comment.likes}</span>
                                            </button>
                                            <button
                                                onClick={() => handleCommentReaction(comment._id, 'dislike')}
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
            {showPostConfirmDeletionModal &&
                <SimpleModal
                    isOpen={showPostConfirmDeletionModal}
                    title="Confirm post deletion"
                    description="Are you sure you want to delete this post?"
                    confirmBtnText="Delete post"
                    cancelBtnText="Cancel"
                    onConfirm={() => handlePostDeletion()}
                    onClose={() => setShowPostConfirmDeletionModal(false)}
                >
                </SimpleModal>}
            {showCommentConfirmDeletionModal &&
                <SimpleModal
                    isOpen={showCommentConfirmDeletionModal}
                    title="Confirm comment deletion"
                    description="Are you sure you want to delete this comment?"
                    confirmBtnText="Delete comment"
                    cancelBtnText="Cancel"
                    onConfirm={() => handleCommentDeletion()}
                    onClose={() => setShowCommentConfirmDeletionModal(false)}
                >
                </SimpleModal>}
        </div>
    );
}
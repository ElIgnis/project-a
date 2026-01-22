'use client'

import { useState } from 'react';
import { LuThumbsUp , LuThumbsDown, LuEllipsisVertical , LuSquarePen , LuTrash2, LuPencilLine } from 'react-icons/lu';
import { User } from 'better-auth';
import Link from 'next/link'
import { Topic } from '@/../lib/utils/topics-validation';

export default function TopicsBoard({userData, postTopics}: { userData: User, postTopics: Topic[] }) {
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [showCommentMenu, setShowCommentMenu] = useState( {} as { [key: string]: boolean } );
    const [postLikes, setPostLikes] = useState(24);
    const [postDislikes, setPostDislikes] = useState(3);

    const currentUser = userData.id;

    const toggleCommentMenu = (id: string) => {
        setShowCommentMenu(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{postTopics.length > 0 ? `Topics (${postTopics.length})` : "No Topics Yet"}</h3>

                <div className="space-y-4">
                    {postTopics.map((postTopic: Topic, index: number) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">{postTopic.username}</span>
                                    <span className="mx-2">•</span>
                                    <span>Insert Date here</span>
                                </div>

                                {/* Comment Menu (Only for owner) */}
                                {postTopic.userId === currentUser && (
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleCommentMenu(postTopic._id)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <LuEllipsisVertical size={16} className="text-gray-600" />
                                        </button>

                                        {showCommentMenu[postTopic._id] && (
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

                            <p className="text-gray-800 mb-2">{postTopic.content}</p>

                            <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm">
                                    <LuThumbsUp size={16} />
                                    <span>{postTopic.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors text-sm">
                                    <LuThumbsDown size={16} />
                                    <span>{postTopic.dislikes}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className= "flex w-full justify-center">
                <Link
                href="/dashboard/topics-board/create-topic"
                className="flex w-min text-nowrap justify-center gap-4 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                    Create Topic <LuPencilLine  className="mt-0.5 ml-auto h-5 w-5 text-gray-50" /> 
                </Link>
            </div>
        </div>
    );
}
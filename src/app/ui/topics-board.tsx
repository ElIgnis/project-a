"use client";

import { useState } from "react";
import {
    LuThumbsUp,
    LuThumbsDown,
    LuEllipsisVertical,
    LuSquarePen,
    LuTrash2,
    LuPencilLine,
    LuArrowRight,
} from "react-icons/lu";
import { UserData } from "@/types/user-interfaces";
import Link from "next/link";
import { Topic } from "@/app/lib/utils/topics-validation";
import { deleteTopicPost } from "@/app/lib/topics-server-actions";
import { SimpleModal } from "./simple-modal";

export default function TopicsBoard({
    userData,
    postTopics,
}: {
    userData: UserData;
    postTopics: Topic[];
}) {
    const [showConfirmDeletionModal, setShowConfirmDeletionModal] =
        useState(false);
    const [idToDelete, setIdToDelete] = useState("");
    const [showModificationsMenuId, setShowModificationMenuId] = useState("");
    const currentUser = userData.id;

    const toggleModificationMenu = (id: string) => {
        setShowModificationMenuId((prevId) => (prevId === id ? "" : id));
    };

    const openDeletionModal = (id: string) => {
        setIdToDelete(id);
        setShowConfirmDeletionModal(true);
    };

    const handlePostDeletion = async () => {
        await deleteTopicPost(idToDelete);
        setIdToDelete("");
        setShowConfirmDeletionModal(false);
    };

    return (
        <div className="mx-auto max-w-4xl space-y-4 p-4">
            {/* Topics Section */}
            <div className="rounded-lg bg-white p-4 shadow-md">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                    {postTopics.length > 0
                        ? `Topics (${postTopics.length})`
                        : "No Topics Yet"}
                </h3>

                <div className="space-y-4">
                    {postTopics.map((postTopic: Topic, index: number) => (
                        <div
                            key={index}
                            className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">
                                        {postTopic.username}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>
                                        {new Date(
                                            postTopic.createdAt,
                                        ).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-3 flex items-start justify-between gap-4">
                                <p className="mb-2 text-lg font-bold break-all text-gray-800">
                                    {postTopic.title}
                                </p>
                                {/* Topic Edit Menu (Only for owner) */}
                                {postTopic.userId === currentUser && (
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                toggleModificationMenu(
                                                    postTopic._id,
                                                )
                                            }
                                            className="rounded-full p-1 transition-colors hover:bg-gray-100"
                                        >
                                            <LuEllipsisVertical
                                                size={16}
                                                className="text-gray-600"
                                            />
                                        </button>

                                        {showModificationsMenuId ===
                                            postTopic._id && (
                                            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                                                <Link
                                                    className="flex w-full items-center space-x-2 px-4 py-2 text-left hover:bg-blue-100"
                                                    href={`/dashboard/topics-board/edit-topic/${postTopic._id}`}
                                                >
                                                    <LuSquarePen
                                                        className="stroke-black"
                                                        size={14}
                                                    />
                                                    <span className="text-sm text-black">
                                                        Edit Post
                                                    </span>
                                                </Link>
                                                <button
                                                    className="flex w-full items-center space-x-2 px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                                    onClick={() =>
                                                        openDeletionModal(
                                                            postTopic._id,
                                                        )
                                                    }
                                                >
                                                    <LuTrash2 size={14} />
                                                    <span className="text-sm">
                                                        Delete Post
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-sm text-gray-600 transition-colors hover:text-blue-600">
                                    <LuThumbsUp size={16} />
                                    <span>{postTopic.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-sm text-gray-600 transition-colors hover:text-red-600">
                                    <LuThumbsDown size={16} />
                                    <span>{postTopic.dislikes}</span>
                                </button>
                            </div>

                            <div className="mt-2 flex w-full justify-end">
                                <Link
                                    href={`/dashboard/topics-board/${postTopic._id}`}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    View Post{" "}
                                    <LuArrowRight className="inline-block h-4 w-4 text-blue-600" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex w-full justify-center">
                <Link
                    href="/dashboard/topics-board/create-topic"
                    className="flex w-min justify-center gap-x-2 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-nowrap text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                    Create Topic{" "}
                    <LuPencilLine className="mt-0.5 ml-auto h-5 w-5 text-gray-50" />
                </Link>
            </div>

            {showConfirmDeletionModal && (
                <SimpleModal
                    isOpen={showConfirmDeletionModal}
                    title="Confirm post deletion"
                    description="Are you sure you want to delete this post?"
                    confirmBtnText="Delete"
                    cancelBtnText="Cancel"
                    onConfirm={() => handlePostDeletion()}
                    onClose={() => setShowConfirmDeletionModal(false)}
                ></SimpleModal>
            )}
        </div>
    );
}

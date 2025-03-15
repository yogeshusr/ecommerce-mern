//import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { startsGenerator } from "../../constants/helper";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Delete, Edit2 } from "lucide-react";
import { Colors } from "../../constants/colors";
//import useErrorLogout from "../../hooks/use-error-logout";

const ReviewsComponent = ({ productId }) => {
  const [reviewList, setReviewList] = useState([]);
  const [editing, setEditing] = useState({
    status: false,
    reviewId: null,
    review: "",
  });
  const [newReview, setNewReview] = useState({
    review: "",
    rating: 0,
  });
  const [newReply, setNewReply] = useState({ review: "" });
  const [replyingTo, setReplyingTo] = useState(null);

  //const { handleErrorLogout } = useErrorLogout();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/" + `/get-reviews/${productId}`
        );
        const { data } = await res.data;
        setReviewList(data);
      } catch (error) {}
    };
    getReviews();
  }, [productId]);

  const addReview = async () => {
    if (!newReview.review || !newReview.rating) {
      return toast.error("Review and Rating cannot be empty");
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api" + "/create-review",
        {
          rating: newReview.rating,
          review: newReview.review,
          productId: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, message } = res.data;
      toast.success(message);
      setReviewList([...reviewList, data]);
      setNewReview({ review: "", rating: 0 });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        toast.error("Failed to add review. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      const res = await axios.delete(
        "http://localhost:5000/api/" + `/delete-review/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { message } = await res.data;
      toast.success(message);
      setReviewList(reviewList.filter((review) => review._id !== reviewId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        toast.error("Failed to delete review. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const editReview = async (reviewId) => {
    if (!confirm("Are you sure you want to edit this review?")) {
      return;
    }
    try {
      const res = await axios.put(
        "http://localhost:5000/api/" + `/update-review/${reviewId}`,
        {
          updatedReview: editing.review,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, message } = await res.data;
      setReviewList(
        reviewList.map((review) => (review._id === reviewId ? data : review))
      );
      toast.success(message);
      setEditing({
        status: false,
        reviewId: null,
        review: "",
      });
    } catch (error) {
      //return handleErrorLogout(error, "Error while editing review");
    }
  };

  const addReply = async (reviewId) => {
    if (!newReply.review) {
      return toast.error("Reply cannot be empty");
    }
    try {
      const res = await axios.put(
        "http://localhost:5000/api/" + `/reply-review/${reviewId}`,
        {
          review: newReply.review,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, message } = await res.data;
      toast.success(message);
      setReviewList((prev) => {
        return prev.map((review) => {
          if (review._id === reviewId) {
            return data;
          }
          return review;
        });
      });
      setNewReply({ review: "" });
      setReplyingTo(null);
    } catch (error) {
      //return handleErrorLogout(error, "Error while replying");
    }
  };

  return (
    <div className="my-10 sm:my-20 w-[93vw] lg:w-[70vw] mx-auto">
      <h3 className="font-extrabold text-2xl text-gray-800 dark:text-white mb-8 text-center">
        Reviews
      </h3>

      {/* WRITE REVIEW SECTION */}
      <div className="rounded-lg">
        <h4 className="font-semibold text-lg text-gray-700 dark:text-customIsabelline mb-4">
          Write a review
        </h4>
        <Textarea
          placeholder="Your Review"
          className="mb-4"
          value={newReview.review}
          onChange={(e) =>
            setNewReview({
              ...newReview,
              review: e.target.value,
            })
          }
        />
        <div className="flex gap-5">
          <Input
            type="number"
            max="5"
            min="1"
            className="mb-4 w-[10rem]"
            placeholder="Rating(1-5)"
            value={newReview.rating}
            onChange={(e) => {
              setNewReview({
                ...newReview,
                rating: Number(e.target.value),
              });
            }}
          />
          <Button onClick={addReview}>Submit Review</Button>
        </div>
      </div>

      {/*REVIEWS LIST */}
      <div className="space-y-6 my-10">
        {reviewList?.map((review) => (
          <div
            key={review?._id}
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg dark:bg-zinc-900 dark:border-none"
          >
            {/* Reviewer info */}
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/40"
                alt={review?.userId?.name}
                className="w-10 h-10 rounded-full mr-4 border border-gray-300"
              />
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h4>{review?.userId?.name}</h4>
              <div className="flex items-center mt-1">
                {startsGenerator(review?.rating, "0", 15)}
              </div>
            </div>

            {/* Review Content */}
            {user?.id === review?.userId?._id &&
            editing.status &&
            editing.reviewId === review?._id ? (
              <Input
                value={editing.review}
                onChange={(e) =>
                  setEditing({
                    review: e.target.value,
                    status: true,
                    reviewId: review?._id,
                  })
                }
              />
            ) : (
              <p className="text-gray-600 text-sm dark:text-customGray">
                {review?.review}
              </p>
            )}

            {/*REPLY SECTION */}
            {review?.replies?.length > 0 && (
              <div className="mt-5 bg-gray-50 p-4 rounded-lg border dark:bg-zinc-800">
                <h5 className="font-bold text-sm text-gray-700 mb-3 dark:text-customYellow">
                  Replies ({review?.replies?.length})
                </h5>
                <div className="space-y-4">
                  {review?.replies?.map((reply) => (
                    <div
                      key={reply?._id}
                      className="flex items-start space-x-4 border-b pb-3 last:border-none"
                    >
                      <img
                        src="https://via.placeholder.com/32"
                        alt={reply?.userId?.name}
                        className="w-8 h-8 rounded-full mr-4 border border-gray-300"
                      />
                      <div>
                        <h6 className="font-medium text-gray-800 text-sm dark:text-customIsabelline capitalize">
                          {reply?.userId?.name}
                        </h6>
                        <p className="text-gray-600 text-sm dark:text-customGray">
                          {reply?.review}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* */}
            {replyingTo === review?._id && (
              <div className="mt-4">
                <Textarea
                  placeholder="Write your reply..."
                  value={newReply?.review}
                  onChange={(e) => setNewReply({ review: e.target.value })}
                />
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => addReply(review?._id)}
                >
                  Reply
                </Button>
              </div>
            )}
            <div className="flex gap-5 justify-center items-center mt-4">
              <button
                className="text-sm text-customYellow hover:underline"
                onClick={() =>
                  setReplyingTo(replyingTo === review?._id ? null : review?._id)
                }
              >
                {replyingTo === review?._id ? "Cancel" : "Reply"}
              </button>

              {user?.id === review?.userId?._id && (
                <>
                  {editing.status ? (
                    <span
                      onClick={() => editReview(review._id)}
                      className="text-sm text-customYellow cursor-pointer hover:underline"
                    >
                      Save
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-2 border-b bg-transparent hover:border-customYellow cursor-pointer text-customYellow"
                      onClick={() =>
                        setEditing({
                          status: true,
                          reviewId: review?._id,
                          review: review?.review,
                        })
                      }
                    >
                      <Edit2 size={15} color={Colors.customYellow} />
                      <span>Edit</span>
                    </span>
                  )}

                  <span
                    className="flex items-center gap-2 border-b bg-transparent hover:border-customYellow cursor-pointer text-customYellow"
                    onClick={() => deleteReview(review._id)}
                  >
                    <Delete size={20} color={Colors.customYellow} />
                    <span>Delete</span>
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsComponent;

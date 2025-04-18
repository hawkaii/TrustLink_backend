import postServices from "../services/postServices.js";

const postController = {
  // Like a post
  likePost: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;
    const profileId = req.user.profileId;
    try {
      const postLike = await postServices.likePost(postId, userId, profileId);
      res.status(200).json(postLike);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Unlike a post
  unlikePost: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;
    try {
      await postServices.unlikePost(postId, userId);
      res.status(200).json({ message: "Post unliked" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get likes for a post
  getPostLikes: async (req, res) => {
    const postId = req.params.id;
    try {
      const likes = await postServices.getPostLikes(postId);
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createComment: async (req, res) => {
    const { body } = req.body;
    const postId = req.params.id;
    const profileId = req.user.profileId;
    try {
      const comment = await postServices.createComment(postId, profileId, body);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default postController;

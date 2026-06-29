import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import API from '../../services/api';
import { createComments, readComments } from '../../services/commentServices';

const initialState = {
  comments: [],
  loading: false,
  error: null,
  message : null
};



export const createComment = createAsyncThunk("comments/commentForm",
    async({issueId,data}, {rejectWithValue}) => {
       try{
        const response = await createComments(issueId,data);
        return response.data;
       }catch(e){
        return rejectWithValue(e.message)
       }
    }
)

export const fetchComments = createAsyncThunk(
  "issues/fetchComments",
  async (issueId, { rejectWithValue }) => {
    try {
      const response = await readComments(issueId);
      return response.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data || e.message
      );
    }
  }
);








const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    },

    clearCommentMessage: (state) => {
      state.message = null;
    },

    resetComments: (state) => {
      state.comments = [];
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {

    // Create Comment
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;

        // If your backend returns the created comment
        state.comments.unshift(action.payload);

        state.message = "Comment created successfully";
      })

      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })

      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCommentError,
  clearCommentMessage,
  resetComments,
} = commentSlice.actions;

export default commentSlice.reducer;
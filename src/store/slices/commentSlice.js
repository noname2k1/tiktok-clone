import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
    },
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        addComment: (state, action) => {
            state.comments = [...state.comments, action.payload];
        },
        editComment: (state, action) => {
            state.comments = state.comments.map((comment) => {
                if (comment.id === action.payload.id) {
                    return action.payload;
                }
                return comment;
            });
        },
        deleteComment: (state, action) => {
            state.comments = state.comments.filter((comment) => comment.id !== action.payload);
        },
    },
});

const { actions, reducer } = commentSlice;
export const { setComments, addComment, editComment, deleteComment } = actions;
export default reducer;

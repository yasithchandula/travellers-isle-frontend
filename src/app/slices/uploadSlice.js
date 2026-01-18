import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uploadFileApi } from "../../api/mock/uploadApi";

export const uploadFile = createAsyncThunk(
    "upload/file",
    async ({ file, type }, { rejectWithValue }) => {
        try {
            return await uploadFileApi({ file, type });
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "File upload failed"
            );
        }
    }
);

const uploadSlice = createSlice({
    name: "upload",
    initialState: {
        uploading: false,
        uploaded: null,
        error: null,
    },
    reducers: {
        clearUpload(state) {
            state.uploaded = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.uploading = false;
                state.uploaded = action.payload;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUpload } = uploadSlice.actions;
export default uploadSlice.reducer;

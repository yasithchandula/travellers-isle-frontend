import api from "@/api/axios";

export const uploadFileApi = async ({ file, type }) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);
    const response = await api.post(
        "/upload/file",
        formData,
        {
            headers: {
                // override only for this request
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../common/Button";
import Select from "../common/Select";
import { toast } from "sonner";

import { fetchUsers } from "../../app/slices/userSlice";

export default function AssignInquiryForm({
    inquiryId,
    onSubmit,
    onCancel
}) {

    const dispatch = useDispatch();

    const { items: users = [], loading } = useSelector((s) => s.users);

    const [userId, setUserId] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    function handleSubmit(e) {

        e.preventDefault();

        if (!userId) {
            toast.error("Please select an executive");
            return;
        }


        try {

            onSubmit({
                inquiry_id: inquiryId,
                user_id: Number(userId)
            });

            toast.success("Executive assigned");

        } catch {

            toast.error("Failed to assign executive");

        }

    }

    const activeUsers = users.filter(
        (u) => u.status === "ACTIVE"
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >

            <Select
                label="Assign Executive"
                value={userId}
                onChange={(v) => setUserId(v)}
                options={[
                    { value: "", label: loading ? "Loading users..." : "Select executive" },

                    ...activeUsers.map((u) => ({
                        value: u.id,
                        label: `${u.display_name} — ${u.role}`
                    }))
                ]}
            />

            <div className="flex justify-end gap-2 border-t bg-card pt-4">

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button type="submit" className="min-w-[150px]">
                    Assign Executive
                </Button>

            </div>

        </form>
    );
}

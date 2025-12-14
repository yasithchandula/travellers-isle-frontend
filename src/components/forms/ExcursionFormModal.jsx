// src/components/forms/ExcursionFormModal.jsx
import { useEffect, useState } from "react";
import destinations from "../../mock/destinations.json";

const PRICING_TYPES = [
    { value: "PER_PERSON", label: "Per Person" },
    { value: "SAFARI", label: "Safari" },
    { value: "BOAT", label: "Boat" },
    { value: "CUSTOM", label: "Custom Value" },
    { value: "FREE", label: "All Free" },
];

export default function ExcursionFormModal({ open, onClose, onSave, initialData }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(() => getInitialForm(initialData));

    useEffect(() => {
        setForm(getInitialForm(initialData));
        setStep(1);
    }, [initialData, open]);

    if (!open) return null;

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateNested = (group, field, value) => {
        setForm((prev) => ({
            ...prev,
            [group]: { ...(prev[group] || {}), [field]: value },
        }));
    };

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {initialData ? "Edit Excursion" : "Add Excursion"}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Manage excursion details, pricing and reminders.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-xl px-2">
                        ✕
                    </button>
                </div>

                {/* Step Tabs */}
                <div className="flex gap-2 px-6 py-3 border-b bg-gray-50 text-sm">
                    {[
                        { n: 1, label: "Basic Info" },
                        { n: 2, label: "Pricing" },
                        { n: 3, label: "Reminders" },
                        { n: 4, label: "Images" },
                    ].map((s) => (
                        <button
                            key={s.n}
                            onClick={() => setStep(s.n)}
                            className={`px-3 py-1 rounded-full ${step === s.n
                                    ? "bg-[color:var(--ti-primary)] text-white"
                                    : "bg-white border text-gray-600"
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {step === 1 && (
                        <StepBasic form={form} updateField={updateField} />
                    )}
                    {step === 2 && (
                        <StepPricing form={form} updateField={updateField} updateNested={updateNested} />
                    )}
                    {step === 3 && (
                        <StepReminders form={form} updateField={updateField} />
                    )}
                    {step === 4 && <StepImages form={form} updateField={updateField} />}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                    <div className="text-xs text-gray-500">
                        Step {step} of 4
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 text-sm" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="btn-primary text-sm"
                            onClick={step < 4 ? () => setStep(step + 1) : handleSubmit}
                        >
                            {step < 4 ? "Next" : "Save Excursion"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getInitialForm(initialData) {
    return (
        initialData || {
            name: "",
            destinationId: "",
            destinationName: "",
            stopName: "",
            description: "",
            pricingType: "PER_PERSON",
            isOptionalSupplement: false,
            requiresReminder: false,
            reminderDaysBefore: 0,
            reminderDaysAfter: 0,
            reminderNote: "",
            tags: [],
            safariConfig: {
                jeepRent: 0,
                perPersonEntrance: 0,
                jeepEntrance: 0,
                maxPersonsPerJeep: 6,
                vatPercent: 18,
                isFullDay: false,
                lunchPerPerson: 0,
            },
            perPersonConfig: {
                infantFrom: 0,
                infantTo: 2,
                infantPrice: 0,
                childFrom: 3,
                childTo: 11,
                childPrice: 0,
                adultFrom: 12,
                adultPrice: 0,
                guideFee: 0,
            },
            boatConfig: {
                boatPrice: 0,
                maxCapacity: 8,
                guideFee: 0,
            },
            customConfig: {
                customValue: 0,
            },
            images: [],
            primaryImageUrl: "",
        }
    );
}

/* ------------ Step 1: Basic Info ------------ */
function StepBasic({ form, updateField }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium">Excursion Name</label>
                <input
                    className="w-full border rounded-lg p-2 mt-1"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Destination</label>
                    <select
                        className="w-full border rounded-lg p-2 mt-1"
                        value={form.destinationId}
                        onChange={(e) => {
                            const dest = destinations.find((d) => String(d.id) === e.target.value);
                            updateField("destinationId", e.target.value);
                            updateField("destinationName", dest ? dest.name : "");
                        }}
                    >
                        <option value="">Select destination</option>
                        {destinations.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Stop (optional)</label>
                    <input
                        className="w-full border rounded-lg p-2 mt-1"
                        placeholder="e.g., Udawalawe gate"
                        value={form.stopName}
                        onChange={(e) => updateField("stopName", e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <input
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="family, wildlife, culture"
                    value={form.tags.join(", ")}
                    onChange={(e) =>
                        updateField(
                            "tags",
                            e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                        )
                    }
                />
            </div>

            <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                    className="w-full border rounded-lg p-2 mt-1 h-24"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                />
            </div>

            <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={form.isOptionalSupplement}
                        onChange={(e) => updateField("isOptionalSupplement", e.target.checked)}
                    />
                    Optional supplement
                </label>
            </div>
        </div>
    );
}

/* ------------ Step 2: Pricing ------------ */
function StepPricing({ form, updateField, updateNested }) {
    const pt = form.pricingType;

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium">Pricing Model</label>
                <select
                    className="w-full border rounded-lg p-2 mt-1"
                    value={form.pricingType}
                    onChange={(e) => updateField("pricingType", e.target.value)}
                >
                    {PRICING_TYPES.map((p) => (
                        <option key={p.value} value={p.value}>
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>

            {pt === "PER_PERSON" && (
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Age Ranges</h4>
                        <div className="flex gap-2 items-center text-xs text-gray-500">
                            Infant / Child / Adult ranges with prices
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Infant from"
                                value={form.perPersonConfig.infantFrom}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "infantFrom", Number(e.target.value))
                                }
                            />
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Infant to"
                                value={form.perPersonConfig.infantTo}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "infantTo", Number(e.target.value))
                                }
                            />
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Child from"
                                value={form.perPersonConfig.childFrom}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "childFrom", Number(e.target.value))
                                }
                            />
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Child to"
                                value={form.perPersonConfig.childTo}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "childTo", Number(e.target.value))
                                }
                            />
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Adult from"
                                value={form.perPersonConfig.adultFrom}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "adultFrom", Number(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Prices</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Infant price"
                                value={form.perPersonConfig.infantPrice}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "infantPrice", Number(e.target.value))
                                }
                            />
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Child price"
                                value={form.perPersonConfig.childPrice}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "childPrice", Number(e.target.value))
                                }
                            />
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Adult price"
                                value={form.perPersonConfig.adultPrice}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "adultPrice", Number(e.target.value))
                                }
                            />
                            <input
                                type="number"
                                className="border rounded-lg p-2"
                                placeholder="Guide fee (optional)"
                                value={form.perPersonConfig.guideFee}
                                onChange={(e) =>
                                    updateNested("perPersonConfig", "guideFee", Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {pt === "SAFARI" && (
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Jeep & Park</h4>
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full"
                            placeholder="Jeep rent (LKR)"
                            value={form.safariConfig.jeepRent}
                            onChange={(e) =>
                                updateNested("safariConfig", "jeepRent", Number(e.target.value))
                            }
                        />
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full"
                            placeholder="Per person entrance fee"
                            value={form.safariConfig.perPersonEntrance}
                            onChange={(e) =>
                                updateNested("safariConfig", "perPersonEntrance", Number(e.target.value))
                            }
                        />
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full"
                            placeholder="Jeep entrance fee"
                            value={form.safariConfig.jeepEntrance}
                            onChange={(e) =>
                                updateNested("safariConfig", "jeepEntrance", Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Rules</h4>
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full"
                            placeholder="Max persons per jeep"
                            value={form.safariConfig.maxPersonsPerJeep}
                            onChange={(e) =>
                                updateNested("safariConfig", "maxPersonsPerJeep", Number(e.target.value))
                            }
                        />
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full"
                            placeholder="VAT %"
                            value={form.safariConfig.vatPercent}
                            onChange={(e) =>
                                updateNested("safariConfig", "vatPercent", Number(e.target.value))
                            }
                        />
                        <label className="flex items-center gap-2 text-sm mt-2">
                            <input
                                type="checkbox"
                                checked={form.safariConfig.isFullDay}
                                onChange={(e) =>
                                    updateNested("safariConfig", "isFullDay", e.target.checked)
                                }
                            />
                            Full day safari (2× jeep + lunch)
                        </label>
                        {form.safariConfig.isFullDay && (
                            <input
                                type="number"
                                className="border rounded-lg p-2 w-full mt-2"
                                placeholder="Lunch per person"
                                value={form.safariConfig.lunchPerPerson}
                                onChange={(e) =>
                                    updateNested("safariConfig", "lunchPerPerson", Number(e.target.value))
                                }
                            />
                        )}
                    </div>
                </div>
            )}

            {pt === "BOAT" && (
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Boat price</label>
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full mt-1"
                            value={form.boatConfig.boatPrice}
                            onChange={(e) =>
                                updateNested("boatConfig", "boatPrice", Number(e.target.value))
                            }
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Max capacity per boat</label>
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full mt-1"
                            value={form.boatConfig.maxCapacity}
                            onChange={(e) =>
                                updateNested("boatConfig", "maxCapacity", Number(e.target.value))
                            }
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Guide fee (optional)</label>
                        <input
                            type="number"
                            className="border rounded-lg p-2 w-full mt-1"
                            value={form.boatConfig.guideFee}
                            onChange={(e) =>
                                updateNested("boatConfig", "guideFee", Number(e.target.value))
                            }
                        />
                    </div>
                </div>
            )}

            {pt === "CUSTOM" && (
                <div>
                    <label className="text-sm font-medium">Custom total value (LKR)</label>
                    <input
                        type="number"
                        className="border rounded-lg p-2 w-full mt-1"
                        value={form.customConfig.customValue}
                        onChange={(e) =>
                            updateNested("customConfig", "customValue", Number(e.target.value))
                        }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        If this value is 0, quotation flow should not continue.
                    </p>
                </div>
            )}

            {pt === "FREE" && (
                <p className="text-sm text-gray-500">
                    This excursion will be considered free of charge in calculations.
                </p>
            )}
        </div>
    );
}

/* ------------ Step 3: Reminders ------------ */
function StepReminders({ form, updateField }) {
    return (
        <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={form.requiresReminder}
                    onChange={(e) => updateField("requiresReminder", e.target.checked)}
                />
                Requires advance booking reminder
            </label>

            {form.requiresReminder && (
                <>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Days before</label>
                            <input
                                type="number"
                                className="border rounded-lg p-2 w-full mt-1"
                                value={form.reminderDaysBefore}
                                onChange={(e) =>
                                    updateField("reminderDaysBefore", Number(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Days after</label>
                            <input
                                type="number"
                                className="border rounded-lg p-2 w-full mt-1"
                                value={form.reminderDaysAfter}
                                onChange={(e) =>
                                    updateField("reminderDaysAfter", Number(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Reminder note</label>
                        <textarea
                            className="border rounded-lg p-2 w-full mt-1 h-20"
                            value={form.reminderNote}
                            onChange={(e) => updateField("reminderNote", e.target.value)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

/* ------------ Step 4: Images (simple mock) ------------ */
function StepImages({ form, updateField }) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                For now, you can paste image URLs. Later, this can be replaced with a real uploader.
            </p>

            <div>
                <label className="text-sm font-medium">Primary image URL</label>
                <input
                    className="border rounded-lg p-2 w-full mt-1"
                    value={form.primaryImageUrl || ""}
                    onChange={(e) => updateField("primaryImageUrl", e.target.value)}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Additional image URLs (comma separated)</label>
                <input
                    className="border rounded-lg p-2 w-full mt-1"
                    value={(form.images || []).join(", ")}
                    onChange={(e) =>
                        updateField(
                            "images",
                            e.target.value
                                .split(",")
                                .map((u) => u.trim())
                                .filter(Boolean)
                        )
                    }
                />
            </div>
        </div>
    );
}

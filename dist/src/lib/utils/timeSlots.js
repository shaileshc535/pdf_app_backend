"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlotIndex = exports.getSlots = void 0;
const date_fns_1 = require("date-fns");
function getSlots(start, end, intervalInMinutes = 30) {
    if ((0, date_fns_1.isAfter)(start, end)) {
        throw new Error("start must be before end");
    }
    const slots = [];
    let current = start;
    while ((0, date_fns_1.isAfter)(end, new Date(current.getTime() + (intervalInMinutes - 1) * 60000))) {
        slots.push({
            start: current,
            end: new Date(current.getTime() + (intervalInMinutes - 1) * 60000),
        });
        current = new Date(current.getTime() + intervalInMinutes * 60000);
    }
    return slots;
}
exports.getSlots = getSlots;
function getSlotIndex(slots, selectedTime) {
    return slots.findIndex((slot) => (0, date_fns_1.isEqual)(slot.start, selectedTime) ||
        ((0, date_fns_1.isAfter)(selectedTime, slot.start) && (0, date_fns_1.isBefore)(selectedTime, slot.end)) ||
        (0, date_fns_1.isEqual)(slot.end, selectedTime));
}
exports.getSlotIndex = getSlotIndex;
//# sourceMappingURL=timeSlots.js.map
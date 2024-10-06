// src/utils/calculateAge.js
const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust if days < 0
    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += previousMonth.getDate();
    }

    // Adjust if months < 0
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    let ageParts = [];

    // Add days if more than 0
    if (days > 0) {
        ageParts.push(`${days} วัน`);
    }

    // Add months if more than 0
    if (months > 0) {
        ageParts.push(`${months} เดือน`);
    }

    // Add years if more than 0
    if (years > 0) {
        ageParts.push(`${years} ปี`);
    }

    // Combine parts
    return ageParts.join(' ');
};

export default calculateAge; // Export the function

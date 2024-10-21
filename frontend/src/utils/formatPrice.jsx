export const formatPrice = (price) => {
    return Math.floor(price).toLocaleString(); // เอาทศนิยมออกและเพิ่มการคั่นหลัก
};
export const maskName = (name: string) => {
    if (!name) return "";
    return name
        .split(" ")
        .filter(Boolean)
        .map(part => part[0].toUpperCase())
        .join(" ");
}

export const maskEmail = (email: string) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    return `${local[0]}***@${domain}`;
}
export const maskPhone = (phone: string) => {
    if (!phone || phone.length < 4) return phone;
    return phone.slice(0, 4) + "****"
}

export const maskHandle = (handle: string) => {
    if (!handle || handle.length < 3) return handle;
    return handle.slice(0, 3) + "****"
}
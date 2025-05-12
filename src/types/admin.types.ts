
export interface Role {
    roleId: number;
    name: string;
}   

export interface AdminUser {
    accountId: number;
    email: string;
    password: null;
    firstName: string | null;
    lastName: string | null;
    username: string;
    profilePicture: string | null;
    birthDate: string | null;
    gender: string | null;
    hometown: string | null;
    phoneNumber: string | null;
    facultyId: number | null;
    major: string | null;
    enrollmentYear: number | null;
    classNumber: string | null;
    isDeleted: boolean;
    isActive: boolean;
    roles: Role[];
}

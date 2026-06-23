import { apiRequest } from "@/lib/apiClient"

export interface AdminProfile {
  id: number
  username: string
  email: string
  phone: string | null
  about_me: string | null
  inspiration: string | null
  hobby: string | null
  fun_fact: string | null
  gender: number | null
  profile_pic: string | null
  profile_video: string | null
  talent: string | null
  community_rules: boolean
  followers_count: number
  following_count: number
  likes_count: number
  challenges_count: number
}

export interface MyProfileResponse {
  profile: AdminProfile
  user_id: number
  email_verified: boolean
  phone_verified: boolean
  is_active: boolean
}

export interface UpdateProfilePayload {
  phone?: string
  about_me?: string
  inspiration?: string
  hobby?: string
  fun_fact?: string
  gender?: number
  profile_pic?: string
  profile_video?: string
  talent?: string
  community_rules?: boolean
}

export function getMyProfile(): Promise<MyProfileResponse> {
  return apiRequest<MyProfileResponse>("/api/v1/accounts/user/profile/")
}

export function updateMyProfile(payload: UpdateProfilePayload): Promise<Partial<AdminProfile>> {
  return apiRequest<Partial<AdminProfile>>("/api/v1/accounts/user/update-profile/", {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function updateMyProfilePicture(profilePicUrl: string): Promise<{ profile_pic: string }> {
  return apiRequest<{ profile_pic: string }>("/api/v1/accounts/users/profile/picture/", {
    method: "POST",
    body: JSON.stringify({ profile_pic: profilePicUrl }),
  })
}

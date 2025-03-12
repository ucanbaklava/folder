type CreateUserType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "github";
  createdAt: Date;
};

type UserParams = {
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "github";
  email_verified: boolean;
};

type Role = "viewer" | "editor" | "owner" | "none";
type Member = {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  role: Role;
};
type Invitee = {
  id?: string;
  avatar?: string;
  name?: string;
  email: string;
  role: Role;
};

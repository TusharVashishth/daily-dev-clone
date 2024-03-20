export default class Env {
  static API_URL: string = process.env.NEXT_PUBLIC_API_URL as string;
  static APP_URL: string = process.env.NEXT_PUBLIC_NEXTAUTH_URL as string;
}

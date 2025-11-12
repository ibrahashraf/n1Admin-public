import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['ibrahim10ashrafh@gmail.com', 'venus.outlet2015@gmail.com'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // 👇 Runs before the session is created
    async signIn({ user }) {
      if (adminEmails.includes(user.email)) {
        return true; // ✅ allow login
      } else {
        return false; // ❌ block login immediately
      }
    },

    // Add admin info to the session
    async session({ session }) {
      session.user.isAdmin = adminEmails.includes(session?.user?.email);
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    throw new Error('Only admins have permission to make that order');
  }
}

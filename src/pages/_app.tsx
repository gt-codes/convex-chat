import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import convexConfig from '../../convex.json';
const convex = new ConvexReactClient(convexConfig.origin);

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<ConvexProvider client={convex}>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</ConvexProvider>
	);
};

export default MyApp;

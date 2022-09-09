import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import convexConfig from '../../convex.json';
import Header from '../components/Header';
const convex = new ConvexReactClient(convexConfig.origin);

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<ConvexProvider client={convex}>
			<SessionProvider session={session}>
				<div className='bg-[#fafafa] items-center relative w-screen h-screen flex flex-col'>
					<Header />
					<div className='w-full max-w-3xl flex flex-col grow items-start overflow-y-scroll scrollbar-hide'>
						<Component {...pageProps} />
					</div>
				</div>
			</SessionProvider>
		</ConvexProvider>
	);
};

export default MyApp;

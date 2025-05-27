// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/db';

// export async function GET(
//   req: Request,
//   context: { params?: { userId?: string } } // Make params and userId optional
// ) {
//   const userId = context?.params?.userId;

//   // Defensive check
//   if (!userId || typeof userId !== 'string') {
//     return NextResponse.json(
//       { error: 'Invalid or missing userId' },
//       { status: 400 }
//     );
//   }

//   try {
//     const db = await connectToDatabase();
//     const user = await db.collection('dynamic_css').findOne({ username: userId });

//     if (!user) {
//       return NextResponse.json(
//         {
//           'primary-color': '#8e24aa',
//           'accent-color': '#ab47bc',
//           'bg-default': '#f8f9fa',
//           'bg-paper': '#ffffff',
//           'text-primary': '#212121',
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(user.theme, {
//       status: 200,
//       headers: {
//         'Cache-Control': 'no-store',
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error.' },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';

export async function GET(
  req: Request,
  { params }: { params: { userId?: string } }
) {
  const { userId } = params;

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json(
      { error: 'Invalid or missing userId' },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const user = await db.collection('dynamic_css').findOne({ username: userId });

    if (!user || !user.theme) {
      return NextResponse.json(
        { error: 'User not found or no theme available' },
        { status: 404 }
      );
    }

    return NextResponse.json(user.theme);
  } catch (error) {
    console.error('Error fetching user theme:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
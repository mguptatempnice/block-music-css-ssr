// // // import React from 'react';
// // // import MusicCards from '../../components/MusicCards';
// // // import { connectToDatabase } from '../../lib/db';

// // // type Props = {
// // //   params: { userId: string };
// // // };

// // // export default async function UserPage({ params: { userId } }: Props) {
// // //   // 1) Default theme values
// // //   const defaultTheme = {
// // //     'primary-color': '#8e24aa',
// // //     'accent-color':  '#ab47bc',
// // //     'bg-default':    '#1a1a1a',
// // //     'bg-paper':      '#242424',
// // //     'text-primary':  '#ffffff',
// // //   };

// // //   // 2) Fetch user theme from MongoDB
// // //   let theme = defaultTheme;
// // //   try {
// // //     const db   = await connectToDatabase();
// // //     const user = await db
// // //       .collection('dynamic_css')
// // //       .findOne({ username: userId });

// // //     if (user?.theme && typeof user.theme === 'object') {
// // //       // Convert any camelCase keys to kebab-case
// // //       const mapped = Object.fromEntries(
// // //         Object.entries(user.theme).map(([key, value]) => [
// // //           key.replace(/([A-Z])/g, '-$1').toLowerCase(),
// // //           value as string,
// // //         ])
// // //       );
// // //       // Merge into defaults
// // //       theme = { ...defaultTheme, ...mapped };
// // //     }
// // //   } catch (e) {
// // //     console.error('Failed loading theme for', userId, e);
// // //   }

// // //   // 3) Build CSS variables string
// // //   const cssText = Object.entries(theme)
// // //     .map(([key, val]) => `--${key}: ${val};`)
// // //     .join(' ');

// // //   // 4) Render: inline the <style> then your content
// // //   return (
// // //     <>
// // //       <style
// // //         dangerouslySetInnerHTML={{ __html: `:root { ${cssText} }` }}
// // //       />
// // //       <div>
// // //         <h1 style={{ color: 'var(--primary-color)' }}>
// // //           Welcome, {userId}!
// // //         </h1>
// // //         <MusicCards />
// // //       </div>
// // //     </>
// // //   );
// // // }

// // import React from 'react';
// // import MusicCards from '../../components/MusicCards';

// // export default function UserPage({ params }: { params: { userId: string } }) {
// //   const userId = params.userId;
// //   return (
// //     <div>
// //       <h1 style={{ color: 'var(--primary-color)' }}>
// //         Welcome, {userId}!
// //       </h1>
// //       <MusicCards />
// //     </div>
// //   );
// // }

// import React from 'react';
// import MusicCards from '../../components/MusicCards';
// import { connectToDatabase } from '../../lib/db';

// type Props = {
//   params: { userId: string };
// };

// export default async function UserPage({ params: { userId } }: Props) {
//   // 1) Default theme values
//   const defaultTheme = {
//     'primary-color': '#8e24aa',
//     'accent-color':  '#ab47bc',
//     'bg-default':    '#1a1a1a',
//     'bg-paper':      '#242424',
//     'text-primary':  '#ffffff',
//   };

//   // 2) Fetch user theme from MongoDB
//   let theme = defaultTheme;
//   try {
//     const db   = await connectToDatabase();
//     const user = await db
//       .collection('dynamic_css')
//       .findOne({ username: userId });

//     if (user?.theme && typeof user.theme === 'object') {
//       // Convert any camelCase keys to kebab-case
//       const mapped = Object.fromEntries(
//         Object.entries(user.theme).map(([key, value]) => [
//           key.replace(/([A-Z])/g, '-$1').toLowerCase(),
//           value as string,
//         ])
//       );
//       // Merge into defaults
//       theme = { ...defaultTheme, ...mapped };
//     }
//   } catch (e) {
//     console.error('Failed loading theme for', userId, e);
//   }

//   // 3) Build CSS variables string
//   const cssText = Object.entries(theme)
//     .map(([key, val]) => `--${key}: ${val};`)
//     .join(' ');

//   // 4) Render: inline the <style> then your content
//   return (
//     <>
//       <style
//         dangerouslySetInnerHTML={{ __html: `:root { ${cssText} }` }}
//       />
//       <div>
//         <h1 style={{ color: 'var(--primary-color)' }}>
//           Welcome, {userId}!
//         </h1>
//         <MusicCards />
//       </div>
//     </>
//   );
// }

import React from 'react';
import MusicCards from '../../components/MusicCards';
import { connectToDatabase } from '../../lib/db';

type Props = {
  params: { userId: string };
};

const defaultTheme = {
  'primary-color': '#8e24aa',
  'accent-color':  '#ab47bc',
  'bg-default':    '#1a1a1a',
  'bg-paper':      '#242424',
  'text-primary':  '#ffffff',
};

function toKebabCase(str: string) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export default async function UserPage({ params }: Props) {
  const { userId } = params; // Access params inside the function body
  let theme = { ...defaultTheme };

  try {
    // Connect to the database and fetch the user's theme
    const db = await connectToDatabase();
    const user = await db.collection('dynamic_css').findOne({ username: userId });

    if (user?.theme && typeof user.theme === 'object') {
      // Convert camelCase keys to kebab-case and merge with the default theme
      const userTheme = Object.fromEntries(
        Object.entries(user.theme).map(([key, value]) => [
          toKebabCase(key),
          value as string
        ])
      );
      theme = { ...theme, ...userTheme };
    }
    console.log('here fetching stuff ----------',theme);
  } catch (error) {
    console.error(`Failed to load theme for user "${userId}":`, error);
  }

  // Generate CSS variables string
  const cssText = Object.entries(theme)
    .map(([key, val]) => `--${key}: ${val};`)
    .join(' ');

  // Render the page with the injected CSS variables
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `:root { ${cssText} }` }} />
      <div>
        <h1 style={{ color: 'var(--primary-color)' }}>
          Welcome, {userId}!
        </h1>
        <MusicCards />
      </div>
    </>
  );
}
/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        // remove private variables from processEnv
        processEnv: Object.fromEntries(
          Object.entries(process.env).filter(([key]) =>
            key.includes('NEXT_PUBLIC_')
          )
        ),
      },
//    env:{
  //      NEXT_PUBLIC_BACKEND_URL:"http://192.168.1.17:8000",
  //  },
};

export default nextConfig;

/**  @type {import("drizzle-kit").Config} */

export default{
    schema: "./lib/db/schema.ts",
    dialect:'postgresql',
    dbCredentials:{
        url:'postgresql://neondb_owner:npg_VI70DbfaMeQm@ep-dry-feather-abxbr0xx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    }
};

;
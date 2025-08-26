import { pgTable, serial, text, integer, real, timestamp, uuid, } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  photoURL: text("photo_url"),
  bio: text("bio"),
  location: text("location"),
  joined: timestamp("joined").defaultNow(),
});




export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: text("price").notNull(), // if numeric, use numeric()
  location: text("location"),
  area: text("area"),
  url: text("url"),
  statusType: text("status_type"),
  imgSrc: text("img_src"),
  has3DModel: text("has_3d_model"),
  addressCity: text("address_city"),
  addressStreet: text("address_street"),
  addressState: text("address_state"),
  addressZipcode: text("address_zipcode"),
  lat: real("lat"), // changed from float() → use real() for Postgres
  lng: real("lng"),
  baths: integer("baths"),
  beds: integer("beds"),
  homeType: text("home_type"),
   userId: uuid("user_id"),
  propertyId: text("property_id"),
});


export const savedHomes = pgTable("saved_homes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  propertyId: text("property_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

# Migration

```go
// Create table
db.CreateTable(&User{})
db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&User{})

// Drop table
db.DropTable(&User{})

// Automating Migration
db.AutoMigrate(&User{})
db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(&User{})
db.AutoMigrate(&User{}, &Product{}, &Order{})
// Feel free to change your struct, AutoMigrate will keep your database up-to-date.
// AutoMigrate will ONLY add *new columns* and *new indexes*,
// WON'T update current column's type or delete unused columns, to protect your data.
// If the table is not existing, AutoMigrate will create the table automatically.
```

# Basic CRUD

## Create Record

```go
user := User{Name: "Jinzhu", Age: 18, Birthday: time.Now()}

db.NewRecord(user) // => returns `true` if primary key is blank

db.Create(&user)

db.NewRecord(user) // => return `false` after `user` created

// Associations will be inserted automatically when save the record
user := User{
	Name:            "jinzhu",
	BillingAddress:  Address{Address1: "Billing Address - Address 1"},
	ShippingAddress: Address{Address1: "Shipping Address - Address 1"},
	Emails:          []Email{{Email: "jinzhu@example.com"}, {Email: "jinzhu-2@example@example.com"}},
	Languages:       []Language{{Name: "ZH"}, {Name: "EN"}},
}

db.Create(&user)
//// BEGIN TRANSACTION;
//// INSERT INTO "addresses" (address1) VALUES ("Billing Address - Address 1");
//// INSERT INTO "addresses" (address1) VALUES ("Shipping Address - Address 1");
//// INSERT INTO "users" (name,billing_address_id,shipping_address_id) VALUES ("jinzhu", 1, 2);
//// INSERT INTO "emails" (user_id,email) VALUES (111, "jinzhu@example.com");
//// INSERT INTO "emails" (user_id,email) VALUES (111, "jinzhu-2@example.com");
//// INSERT INTO "languages" ("name") VALUES ('ZH');
//// INSERT INTO user_languages ("user_id","language_id") VALUES (111, 1);
//// INSERT INTO "languages" ("name") VALUES ('EN');
//// INSERT INTO user_languages ("user_id","language_id") VALUES (111, 2);
//// COMMIT;
```

Refer [Associations](#associations) for more details

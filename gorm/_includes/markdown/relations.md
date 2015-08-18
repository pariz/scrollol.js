# Relations / Associations

## Has One

```go
// User has one address
db.Model(&user).Related(&address)
//// SELECT * FROM addresses WHERE id = 123; // 123 is user's foreign key AddressId

// Specify the foreign key
db.Model(&user).Related(&address1, "BillingAddressId")
//// SELECT * FROM addresses WHERE id = 123; // 123 is user's foreign key BillingAddressId
```

## Belongs To

```go
// Email belongs to user
db.Model(&email).Related(&user)
//// SELECT * FROM users WHERE id = 111; // 111 is email's foreign key UserId

// Specify the foreign key
db.Model(&email).Related(&user, "ProfileId")
//// SELECT * FROM users WHERE id = 111; // 111 is email's foreign key ProfileId
```

## Has Many

```go
// User has many emails
db.Model(&user).Related(&emails)
//// SELECT * FROM emails WHERE user_id = 111;
// user_id is the foreign key, 111 is user's primary key's value

// Specify the foreign key
db.Model(&user).Related(&emails, "ProfileId")
//// SELECT * FROM emails WHERE profile_id = 111;
// profile_id is the foreign key, 111 is user's primary key's value
```

## Many To Many

```go
// User has many languages and belongs to many languages
db.Model(&user).Related(&languages, "Languages")
//// SELECT * FROM "languages" INNER JOIN "user_languages" ON "user_languages"."language_id" = "languages"."id" WHERE "user_languages"."user_id" = 111
// `Languages` is user's column name, this column's tag defined join table like this `gorm:"many2many:user_languages;"`
```

There is also a mode used to handle many to many relations easily

```go
// Query
db.Model(&user).Association("Languages").Find(&languages)
// same as `db.Model(&user).Related(&languages, "Languages")`

db.Where("name = ?", "ZH").First(&languageZH)
db.Where("name = ?", "EN").First(&languageEN)

// Append
db.Model(&user).Association("Languages").Append([]Language{languageZH, languageEN})
db.Model(&user).Association("Languages").Append([]Language{{Name: "DE"}})
db.Model(&user).Association("Languages").Append(Language{Name: "DE"})

// Delete
db.Model(&user).Association("Languages").Delete([]Language{languageZH, languageEN})
db.Model(&user).Association("Languages").Delete(languageZH, languageEN)

// Replace
db.Model(&user).Association("Languages").Replace([]Language{languageZH, languageEN})
db.Model(&user).Association("Languages").Replace(Language{Name: "DE"}, languageEN)

// Count
db.Model(&user).Association("Languages").Count()
// Return the count of languages the user has

// Clear
db.Model(&user).Association("Languages").Clear()
// Remove all relations between the user and languages
```

## Polymorphism

Supports polymorphic has-many and has-one associations.

```go
  type Cat struct {
    Id    int
    Name  string
    Toy   Toy `gorm:"polymorphic:Owner;"`
  }

  type Dog struct {
    Id   int
    Name string
    Toy  Toy `gorm:"polymorphic:Owner;"`
  }

  type Toy struct {
    Id        int
    Name      string
    OwnerId   int
    OwnerType string
  }
```
Note: polymorphic belongs-to and many-to-many are explicitly NOT supported, and will throw errors.

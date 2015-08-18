## Conventions

* Table name is the plural of struct name's snake case, you can disable pluralization with `db.SingularTable(true)`, or [Specifying The Table Name For A Struct Permanently With TableName](#specifying-the-table-name-for-a-struct-permanently-with-tablename)

```go
type User struct{} // struct User's database table name is "users" by default, will be "user" if you disabled pluralisation
```

* Column name is the snake case of field's name
* Use `ID` field as primary key
* Use `CreatedAt` to store record's created time if field exists
* Use `UpdatedAt` to store record's updated time if field exists
* Use `DeletedAt` to store record's deleted time if field exists [Soft Delete](#soft-delete)
* Gorm provide a default model struct, you could embed it in your struct

```go
type Model struct {
	ID        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

type User struct {
	gorm.Model
	Name string
}
```

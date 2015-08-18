# GORM

[![Join the chat at https://gitter.im/jinzhu/gorm](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jinzhu/gorm?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The fantastic ORM library for Golang, aims to be developer friendly.

[![wercker status](https://app.wercker.com/status/0cb7bb1039e21b74f8274941428e0921/s/master "wercker status")](https://app.wercker.com/project/bykey/0cb7bb1039e21b74f8274941428e0921)

## Overview

* Full-Featured ORM (almost)
* Chainable API
* Auto Migrations
* Relations (Has One, Has Many, Belongs To, Many To Many, [Polymorphism](#polymorphism))
* Callbacks (Before/After Create/Save/Update/Delete/Find)
* Preloading (eager loading)
* Transactions
* Embed Anonymous Struct
* Soft Deletes
* Customizable Logger
* Iteration Support via [Rows](#row--rows)
* Every feature comes with tests
* Developer Friendly

## TODO
* db.Select("Languages", "Name").Update(&user)
  db.Omit("Languages").Update(&user)
* Auto migrate indexes
* Github Pages
* AlertColumn, DropColumn
* R/W Splitting, Validation

# Author

**jinzhu**

* <http://github.com/jinzhu>
* <wosmvp@gmail.com>
* <http://twitter.com/zhangjinzhu>

## License

Released under the [MIT License](https://github.com/jinzhu/gorm/blob/master/License).

[![GoDoc](https://godoc.org/github.com/jinzhu/gorm?status.png)](http://godoc.org/github.com/jinzhu/gorm)

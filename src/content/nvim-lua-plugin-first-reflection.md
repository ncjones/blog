---
title: Lua Newcomer Observations
date: 2025-04-13
author: Nathan
desc: |
  Reflection on first attempt at Neovim plugin development with Lua: it's fun,
  object-oriented, and minimal.
img: /img/dev-coffee-notes.webp
---

Today I wrote my first Neovim plugin with Lua. It replicates the "ag.vim"
Silver Searcher Vim plugin that stopped working some time ago and it also has
better auto-completion.

https://github.com/ncjones/dotfiles/blob/master/lvim/.lvim/lua/user/ag_command.lua

Lua is a dynamically typed, general-purpose programming language ideal for
embedding in existing runtime environments for dynamic extension loading. Its
syntax is intuitive and easy to learn and supports object-oriented programming.
My initial observation was that it seemed like a simplified blend of JavaScript
and Ruby. The Lua and Nvim standard libs are comically bare, though, so
programmers often need to do additional work for common tasks like finding
unique items in a collection.

The most striking gap in the Lua language is the lack of a common data
structure abstraction. Lua's foreach loop accepts an abstract iterator but,
unlike Python, there's no standard way to make something iterable. So, in order
to iterate a data structure, you need to know how to create an iterator for it.
From what I can tell, this is the biggest flaw in the language because it means
interoperable code relating to data structures needs to be coupled with the
native "table" data structure.

The Neovim Lua SDK fixes some of the gaps in the Lua standard library.
Surprisingly, it doesn't provide object-oriented solutions for interfacing with
data structures like JavaScript, Ruby or Kotlin do. Instead of chaining
collection methods like map, filter, find, and reduce, Lua devs need to nest
calls to static utility functions. This results in a clunkier developer
experience and code that's harder to read. An example from my Ag plugin is the
custom sorted set data structure abstraction. It needs to be converted back to
a Lua table in order to use collection filtering.

The Neovim standard library also surprisingly lacks higher-level abstractions
for dealing with files and buffers. I found that only low-level access was
available for accessing file trees and buffer contents, so I needed to build my
own abstractions.

Despite the quirks, I enjoyed writing Neovim plugins with Lua overall, and I
expect to be back for more. Next time, I expect to be even more productive
especially if I can get a proper TDD loop running.

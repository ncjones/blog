---
title: Give Your Applications Pet Names
date: 2024-04-29
author: Nathan
desc: |
  Using pet names makes it easier to communicate about your deployable
  applications. A naming scheme makes it easier to choose names for your
  applications.
img: /img/computer-with-binary-on-screen.jpg
---

Pet names are simple, memorable names that we assign to things of importance. A
pet name is not descriptive and has no special meaning other than identifying
that which is named.

A "Deployable application" is a software component that is packaged and
deployed independently. It may take one of many forms such as Docker images
that are deployed to Kubernetes, tarballs that are deployed to a CDN, or native
applications that are deployed to an app store. Deployable applications deserve
to have pet names to make communicating about them easier.

## Why Use Pet Names

Naming things is one of the hardest aspects of software design. Well-named
variables, types, and functions generally will have names that communicate
their purpose. Intuitively we want to name our applications based on the same
principles &mdash; descriptively based on their intended function. The problem with
naming applications descriptively is twofold: firstly, name collisions are
highly likely; and secondly, a descriptive name can lose its accuracy over
time.

Naming applications descriptively will tend to apply domain terminology that is
likely to collide with other elements within a code base. For example, "payment
service" might be the name of a code module within an application. If an
application is also called "payment service" then we have name collision which
creates ambiguity with any comms relating to these components.

The scope of an application's responsibilities tends to shift over time. New
capabilities get added or broken away as the architecture of the overall system
evolves. A "payment service", for example, may evolve such that it gains the
responsibility of sending notifications or loses the responsibility of
persisting transactions directly to a ledger. When this happens, the original
name can become a source of confusion.

A pet name, on the other hand, gives us a name that we can use to refer to an
application unambiguously regardless of what other elements exist in the system
with similar responsibilities and regardless of how its responsibilities change
over time.

The name of an application will appear in many places throughout the overall
system. Examples are:

- documentation
- source repositories
- written and spoken comms
- logging

Wherever application names appear, pet names provide precision and certainty
over the context.

## How to choose pet names

There are three simple rules to make selecting pet names easy:

1. Create a naming register
2. Follow a theme for name selection
3. Assign names in alphabetical order

### Create a naming register

The naming register is a centralized list of assigned application names. The
register may also include chosen but unassigned names. The register can be
hosted in your shared internal documentation tool.

Register entries may include extra related information like links to source
repositories or documentation.

The register should be accompanied by the rules that have been selected for
naming so everyone can agree to and follow them.

### Follow a theme for name selection

Restrict names to a pool of available names. Select the pool of names by
choosing a theme. Themes I have seen used for naming include mountains, lakes,
rocks, chemical elements, satellites, truck manufacturers, and Pokemon
characters.

Choosing the theme is the hardest part. A larger group will struggle to agree
on a naming scheme so an executive decision will likely be required. Ideally,
the pool of names should have plenty of easily pronounceable words. Words with
fewer syllables are also preferable.

### Assign names in alphabetical order

A good theme will have a pool of available names which provides a large amount
of choice. When faced with too many choices, name selection will still be
difficult. At the end of the day, the name is unimportant and time spent
deliberating over name selection is wasteful. We can further reduce the burden
of name selection by choosing names starting with distinct letters. Cycling to
the next letter of the alphabet for each chosen name eliminates most of the
choice.

Distributing names across the alphabet will also improve developer experience
when using auto-completion.

## Conclusion

When building a new software system, one of your first tasks should be to
define the naming scheme for your deployable components. Once you have a naming
scheme in place, comms relating to your applications become clearer and your
colleagues will love you for it.



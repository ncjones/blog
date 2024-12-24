---
title: Tidying First For Sustainable Software Delivery
date: 2024-12-25
author: Nathan
desc: |
  Developers have a duty to maintain delivery velocity through code quality.
  Tidying first is the key to maintaining code quality.
img: /img/comic-book-style-organized-sushi-kitchen.webp
---

Ask any developer how much they care about code quality, and you will get
enthusiastic affirmations. However, ask that same developer about the quality
of their active code base, and chances are you will hear about the tragic state
of quality. This is the paradox of code quality: developers agree that code
quality is critically important, yet most code bases suffer from code quality
issues. Why is this? More importantly, what can we do about it?

In his recent book, "Tidy First?" Kent Beck explores the question, "I have some
messy code — do I change it or tidy it first?" Kent focuses on this scenario
because it occurs frequently in practical software design. He demonstrates how
addressing structural inadequacies in code first, before making behavioral
changes, leads to better software design.

In my opinion, code quality issues result from repeatedly failing to tidy
first. Perhaps this happens because developers assume questioning architecture
is off-limits, or perhaps they are waiting for architectural cleanup to be
explicitly called out in a requirements document. Regardless, it can be
addressed by individual developers taking responsibility and tidying first.
When developers tidy first, code quality is maintained or improved instead of
spiraling into a tragic mess.


## What is Code Quality?

Unlike other components of software quality, like correctness and
responsiveness, code quality does not directly impact the user. Instead, it
only impacts the developer; a developer's job is harder when code quality is
poor.

The relationship between code quality and ease of change is so significant that
"ease of change" is one of the best proxies we have for defining code quality.
In other words, since code quality only matters when code needs to change,
high-quality code can be approximated as code that is easy to change.


## What Makes Code Easy to Change?

Coupling and cohesion are the foundational principles that guide us toward
structuring code that is easy to change. A well-structured code base is
composed of modules that are both loosely coupled and highly cohesive.

Designing cohesive and loosely coupled code is far easier said than done. The
difficulty stems from predicting what will need to change and knowing how to
accommodate that change. The key questions to answer when considering how to
structure our code are:

1. What sort of changes can be expected?
2. What structures or patterns can be applied to accommodate those changes?

An experienced software architect will intuitively know the answers to these
questions. Sometimes the answer may be "we cannot know yet" and in those cases
the best decision may be to not commit to a design.

Testability also influences whether code is easy to change. To be confident
that a change is correct, there must be tests, and the code must be testable.
However, the mere presence of tests is not enough — tests should also be useful
when structural changes are made. Tests that are tightly coupled to
implementation details, through the use of mocking, for example, will become a
burden when refactoring.


## Does Code Quality Matter?

Ask a non technical stakeholder to choose between software that is fully
functional yet hard to change and software that is incomplete yet easy to
change. Chances are that your stakeholders will rather have software that is
easy to change. But this is not how the conversation typically goes.
Stakeholders are usually oblivious to the issues caused by poor software
quality. They generally assume a level of quality will always be delivered and
get frustrated when velocity declines due to changes being too hard. Better
code quality leads to better outcomes and greater stakeholder confidence in the
team.

Code that is never going change will not benefit from being higher quality. But
since most code will eventually need to change, there must be at least some
benefit to maintaining higher quality.

Code of higher quality also tends to be more modular, easier to test, and
easier to verify for correctness through peer review. Thus, code quality also
impacts overall software correctness.


## What Is Tidying?

"Tidying" means the same as "refactoring" — altering the structure of a code
base without impacting its behavior. The word "tidying" may be preferred to
avoid ambiguity due to the misuse of "refactoring" since it was popularized in
Martin Fowler's Refactoring, published in 1999.

Over the last 20 years, in my experience, it has become common for almost any
change to be labeled as a refactoring. "Tidying" and "refactoring" can be used
interchangeably as long as we are actually referring to structural code
changes.


## Keep Tidying Separate

A principle of effective software change management is to work in small
batches. One of the ways we work in small batches is to have changesets
(commits, pull requests etc) that contain a single purpose. Such changes are
smaller, easier to review, less risky, have less chance of conflicts, fewer
bugs, and can be cherry-picked and reverted easily.

A code change with a single purpose is either a behavioral or a structural
change. Keeping behavioral and structural changes in separate changesets has
the same benefits as any other single-purpose change. Ultimately, we move
faster by taking smaller steps.

Structural and behavioral changes also have different risk profiles. Structural
changes require scrutiny from an architectural perspective but are often
low-risk and only require regression testing. Behavioral changes require
scrutiny from a product perspective and require exploratory testing.


## Why Tidy First?

"Make the change easy, then make the easy change". This is the mantra for
tidying first. Tidying first sets us up for success by laying down clean
foundations before building new features. When we implement new features on top
of clean foundations we are less likely to encounter bugs and more likely to be
able to respond to evolving requirements.

<figure>

![Three circles in a row labelled "Tidy First", "Feature Dev", "Done".](/img/tidy-first-flow.png)
  <figcaption>
Tidying first makes implementing a new feature easy and helps to deliver
features on time with fewer bugs.
  </figcaption>
</figure>

When tidying is always done in preparation for some other behavioral change, we
can confidently defer architectural decisions until we have a clear need.
Deferring architectural decisions avoids spending time speculating about
hypothetical trade-offs because we know a tidy first approach will be taken in
the future. When the requirements eventually become clear, the necessary
refactoring will be executed.

When developers regularly reflect on whether to tidy first they will make
better architecture decisions and will become better software architects while
doing so. This simple question, "What will make my change easy", encourages a
boldness to experiment with better software architecture.


## Why Not Tidy Last?

Well-intentioned developers who plan to tidy last will probably never tidy
because of time pressure and waning motivation. This approach leads to a net
decline in quality over time.


<figure>

![Four circles in a row labelled "Feature Dev", "Bug Fix", "Tidy Last", "Never Done".](/img/tidy-last-flow.png)
  <figcaption>
Diving straight into feature development without tidying first increases the
chance of bugs. By the time the delivery budget has been used the tidying is
likely to be reprioritized and never done.
  </figcaption>
</figure>

When tidying is considered a "nice to have," time pressure will result in it
being dropped from the scope. The next project will inevitably come along and
be prioritized above the "nice to have" tidying.

Time pressure aside, after a new feature has been delivered, there is no
incentive to continue tidying. The work that would have benefited from the
tidying has already been done.

The delivery of the functionality without tidying reinforces the misconception
that tidying is not necessary, especially when the next project is not directly
impacted by the untidy code. However, eventually, future opportunities *will*
be impacted by the decision not to tidy, so tidying last has a net negative
impact on overall delivery velocity.


## When to Stop Tidying

Too much tidying is wasteful and leads to over-engineering. But how do we know
when it's too much? Because structural tidying precedes a behavioral change, we
have the context we need to judge quickly if we are done. All we have to do is
ask, "Is my behavioral change going to be easy?" If the answer is "yes," then
the refactoring is good enough.

Sometimes the behavioral change can become an easy change without fulfilling
the entire architectural vision. In these cases how to proceed may depend on
the skill sets of the developers involved. It may be the case that the team is
junior and the architecture is likely to suffer without fully implemented
examples. But ideally, software architecture can be left half implemented
because we trust teammates to tidy first next time if the time is right.

## When To Tidy Later

Tidying first is not a universal rule. But how do we know when it's ok to tidy
later?

Untidy solutions for urgent business needs are acceptable when the cost is low.
Small hacks have a small impact on overall quality. But big changes with
timelines measured in weeks almost always benefit from spending several days
first addressing architectural issues. My rule of thumb is that if the problem
is both urgent and achievable in less than a day, hacking is okay as long as it
does not happen too frequently.

When tidying later is the exception rather than the rule then the team can
easily tolerate these small hacks. The next developer who works on the
suboptimal code will apply the tidy first approach and continue to drive
quality forward.

## What To Tidy

The types of changes which constitute tidying vary in size and complexity. Some
are trivial while others will have a significant impact on the software
architecture.

Some examples of tidying, with increasing cost and complexity, that you may
apply first before implementing new functionality:

 - Rename a variable or function to improve comprehensibility or consistency.
 - Move a static function onto an object to increase cohesion.
 - Introduce a new abstraction to eliminate duplicated logic and enforce
   invariants.
 - Replace a faulty abstraction with a better alternative.
 - Create a new version of an API that replicates the old capability but
   addresses extensibility limitations.
 - Convert the cardinality of an entity relationship from one-to-one to
   one-to-many.

The guiding principle with what to tidy is that we want to make the likely
future changes easier. Martin Fowler's Refactoring is a brilliant resource for
going deeper into what and how to tidy.


## Unexpected Changes

Frequently it's not until after half implementing a behavioral change that we
realize a tidying is required. In this scenario, it's best to pause the
behavioral change and take a moment to tidy. Resist the urge to bundle the
extra tidying along with your original change. After the tidying is done the
behavioral change can be rebased onto the tidying and resumed.


## Who Sets The Priority?

Developers have a professional duty to prioritize fixing code quality when the
time is right. Only developers can observe, judge, and impact code quality. No
other stakeholder can make an informed decision about scheduling improvements
to code quality.

The key to enabling effective tidying is connecting it to a measurable outcome
that other stakeholders can observe. The observable outcome is the behavioral
change enabled by the tidying. The outcome could be nonfunctional, such as
improving application performance.

It is tempting to schedule pure tidying tasks as separate items on a product
backlog. Resist this urge! The risk with scheduling pure tidying tasks is that,
without clear product outcomes as an objective, too much time is spent, and
non-developers struggle to understand the value of the work.

Having conversations upfront about the intention to tidy first can also be
helpful. When the scope of a tidying activity is unknown and potentially large
then use time boxing to limit the scope. This helps stakeholders to understand
the value of the work and trust the team's ability to deliver.


## Summary

Tidying first is the key to sustainable software development. If we don't tidy
first, we probably won't tidy at all. If we don't tidy, code quality will
gradually deteriorate as changes are layered on.

Features developed on untidy foundations will have more bugs. Counting the cost
of bug fixing, tidying first is likely to be the faster way to deliver a
software increment.

If you are a non-technical stakeholder, support your developers to tidy first
by letting them know it's ok. If you are a developer, take responsibility to
make sure enough tidying happens to make your next code change easy.

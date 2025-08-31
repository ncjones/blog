---
title: Escaping the Cornfield
date: 2025-08-31
author: Nathan
desc: |
  The direct path to an objective always feels productive but it might not be
  the shortest path. Lateral movements, like working on tooling or refactoring,
  indirectly lead us to the shortest path.
img: /img/lost-in-the-cornfield.webp
---

Imagine a traveller lost in a dense cornfield. The traveller knows their
ultimate destination: the mountains on the horizon. Just beyond the cornfield,
hidden by the dense vegetation, runs a highway that leads directly there.

![A traveller wandering in a cornfield](/img/lost-in-the-cornfield.webp "The traveller sees his objective in the distance but he does not see the highway that could get him there sooner.")

The problem is not one of effort but one of direction. No matter which
direction the traveller chooses there is going to be hard work wading through
plants. To get to the mountain efficiently, the traveller needs to head towards
the road and escape the cornfield.

![Diagram comparing lateral and direct paths out of a cornfield](/img/cornfield-lateral-path.webp "The direct path is a straight line but the lateral path gets us to the highway, and the objective, sooner.")

The obvious direction, straight towards the mountain, makes that effort
translate directly into progress, but it is not the shortest path. The shortest
path requires choosing a lateral direction relative to the objective. The
shortest path, initially, feels like a lot of effort for little or no gain, but
it leads to a clear path requiring less effort for the remainder of the journey.


## Software Development is Navigating a Cornfield

And so it is with software development. The desired functionality is the
"mountain". The problems to be solved and the lines of code to be written are
the "cornfield". The things which speed us up are the "highway".

To get to the "highway" we [Tidy
First](/posts/tidying-first-for-sustainable-software-development) ‒ we ask
ourselves "what would make this change easy?". The answer to that question will
involve reorganizing existing code. That work to organize existing code is the
short path out of the corn and onto the highway. In practice this could mean
introducing better abstractions, renaming symbols, or extracting smaller
functions.


## Expanding the Analogy

There's a few other ways we can use this cornfield analogy that are helpful for
guiding our approach to software development.

**Agree on the Mountain** ‒ Do we understand the problem? Does the solution
actually align with the objective? If not, chances are we will be spending more
time in the cornfield than we hoped. Get clear on requirements first otherwise
effort will be in vain.

**Choose the Right Highway** ‒ Have we chosen a highway which is actually going
to lead us to the right destination? Or is it going to veer off in the wrong
direction? Choosing the wrong abstraction or the wrong tool are the kinds of
decisions which can be considered "the wrong highway".

**Stay on the Highway** ‒ Do we have systems in place that give us early
feedback so we know if we are heading in the wrong direction? Test automation,
continuous delivery, feature toggles, monitoring and metrics are all tools that
give us feedback on the quality of our work. If our existing tools are
inadequate for giving us the feedback we need then investing in them first is
another kind of lateral move which can help us get to the destination sooner.


## Summary

If you feel like you are endlessly wading through a cornfield then think about
ways to get to a highway. A lateral approach will unlock easier and faster
pathways to the objective.

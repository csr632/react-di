# react-svs-di

react-svs-di is a state managent library with these features:

- Typescript first. Get full intellisense and type-checking when:
  - Subscribe shared state
  - Update shared state
  - Manage async works
- Dependency injection. Encourage users to 'depend on abstractions, don't depend on implementations'. (dependency inversion principle)
  - We use react context to implement DI, but we resolve the problem of 'provider hell', which is ignored by most 'state management libraries'.
- Embrace react hooks. Hooks is a booming trend in react community. You can benefit from the community while using react-svs-di.
- Rxjs friendly. rxjs fit very well in react-svs-di. react-svs-di makes it very easy to use rxjs in react.
  > If you don't like/know rxjs, feel free to drop it!

## Workflow

- Split your app logic and state into multiple services.
  - shared state
  - side effects. Can be async.
    - procedures to update state
    - communicate with backend
- Provide those services at appropriate places of component tree.
- Component ask for some service.
  - Component can 'use' service's state to render view
  - Component can call react hooks provided by the service
  - Component call side effect in it's event handler
    > The service should be provided **above** the component.
- If some side effects change some shared states. Components (that 'use' the shared states) will re-render automatically.
- A service can ask for other services(dependency injection). And call other services' procedures.

## Examples

- Some examples do 'console.log' to proof a point. See it int the 'Actions' tab.
- The source code of an example is in the 'Story' tab.
- Explanation of an example is in the comment of the 'Story' tab.

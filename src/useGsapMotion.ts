import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Blocks that rise into place. #world and #projects keep their own reveal (useSectionMotion).
const blocks = ['#about > div', '#about > section', '#creative > div', '.image-archive > *', '#roadmap > *', '#contact > div']
  .map(selector => `${selector}:not(.vanta-backdrop)`).join(', ');
const heroBits = '.rolling-roles';

// All page motion in one GSAP context. Nothing here runs for reduced motion, and everything is
// reverted on unmount. Elements are only hidden by this script, so content shows without it.
export default function useGsapMotion() {
  useGSAP((_, contextSafe) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;

    // Scroll progress bar.
    gsap.fromTo('.scroll-progress', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true },
    });

    // Opening: the headline types itself (TypedHeadline); the fixed picture opens like a curtain
    // and the rest of the column rises in beneath the headline.
    gsap.set(heroBits, { opacity: 0 });
    const enterHero = contextSafe!(() => {
      gsap.to(heroBits, { opacity: 1, duration: .8, ease: 'power3.out', stagger: .08, delay: .4 });
      gsap.fromTo(heroBits, { y: 20 }, { y: 0, duration: .8, ease: 'power3.out', stagger: .08, delay: .4, clearProps: 'transform' });
      gsap.fromTo('.opening .stage-media', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' });
      gsap.fromTo('.giant-name', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: .5 });
    });
    document.fonts.ready.then(enterHero);

    // Signature move: the giant name sinks a little and the net dims as the opening scrolls away.
    const heroExit = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.giant-name', { scale: .93, yPercent: 12, transformOrigin: 'left bottom', ease: 'none', scrollTrigger: heroExit });
    // A CSS variable, not opacity, so the fade never fights the scene's own fade-in once WebGL is ready.
    gsap.fromTo('.hero-net', { '--scene-fade': 1 }, { '--scene-fade': .2, ease: 'none', scrollTrigger: heroExit });
    // The footer name grows into place as the page ends.
    gsap.fromTo('.footer-name', { scale: .92, transformOrigin: 'left bottom' }, { scale: 1, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    // About: the opening paragraph is a statement whose words light up as it is read.
    const statement = SplitText.create('.about-statement', { type: 'words' });
    gsap.fromTo(statement.words, { opacity: .16 }, {
      opacity: 1, ease: 'none', stagger: .05,
      scrollTrigger: { trigger: '.about-statement', start: 'top 82%', end: 'bottom 40%', scrub: true },
    });



    // Chapter rail: a fixed-length line that fills with overall progress, the percentage scrolled
    // above it, and the chapter under the middle of the screen below it. On every scroll frame it
    // looks at what is really there (never at positions measured earlier, which go stale as images
    // load): the chapter at the centre of the screen names it, and whatever sits behind the rail
    // itself (a field or a band) picks its colour, burgundy over coral and gold, gold over the dark.
    const rail = document.querySelector<HTMLElement>('.chapter-rail');
    const railPercent = rail?.querySelector<HTMLElement>('.rail-percent');
    const railLabel = rail?.querySelector<HTMLElement>('.rail-label');
    const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]');
    const readRail = () => {
      if (!rail || !railLabel) return;
      // The fields only reach the screen edge as painted colour, so sample across the middle of the
      // screen at the rail's own height.
      const box = rail.getBoundingClientRect();
      const behind = document.elementFromPoint(innerWidth / 2, box.top + box.height / 2);
      rail.dataset.tone = behind?.closest('.field-gold, .field-coral, .band') ? 'dark' : 'light';
      // The chapter whose live box holds the middle of the screen, or the last one that started above it.
      const middle = innerHeight / 2;
      let chapter: string | undefined;
      for (const element of chapters) {
        const r = element.getBoundingClientRect();
        if (r.top <= middle) chapter = element.dataset.chapter;
        if (r.top <= middle && r.bottom >= middle) break;
      }
      if (!chapter || railLabel.textContent === chapter) return;
      railLabel.textContent = chapter;
      gsap.fromTo(railLabel, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'power3.out', overwrite: true });
    };
    // Progress counts chapters, not pixels: each top-level chapter is an equal share of the rail and
    // the reading point's position inside a chapter fills that share. Opening a shorter or longer tab
    // in one chapter then barely moves the reading, instead of jumping with the page's new length.
    // The reading point is the top of the screen, so a tab's length below it cannot move the reading.
    const railFill = rail?.querySelector<HTMLElement>('.rail-fill');
    const sections = gsap.utils.toArray<HTMLElement>('main > [data-chapter], main > .split-stage, main > .field-gold, main > .field-plum');
    const readProgress = () => {
      if (!railPercent || !railFill || !sections.length) return;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const y = Math.min(max, Math.max(0, scrollY));
      // The top of the screen, until the last screen of the page, where it runs on to the very bottom.
      const point = y + Math.max(0, y - (max - innerHeight)) * (innerHeight / Math.min(innerHeight, max));
      const tops = sections.map(section => section.getBoundingClientRect().top + scrollY).concat(document.documentElement.scrollHeight);
      let share = 0;
      for (let i = 0; i < sections.length; i++) {
        if (point < tops[i]) break;
        share = i + Math.min(1, (point - tops[i]) / Math.max(1, tops[i + 1] - tops[i]));
      }
      const progress = y >= max - 1 ? 1 : share / sections.length;
      railPercent.textContent = `${Math.round(progress * 100)}%`;
      railFill.style.transform = `scaleY(${progress})`;
    };
    ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: () => { readProgress(); readRail(); }, onRefresh: readProgress });
    readProgress();
    readRail();

    // Blocks rise in, batched so neighbours arriving together stagger.
    const risers = gsap.utils.toArray<HTMLElement>(blocks);
    gsap.set(risers, { opacity: 0, y: 28 });
    const rise = (targets: Element[]) => gsap.to(targets, {
      opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .08, overwrite: true, clearProps: 'transform',
    });
    ScrollTrigger.batch(risers, { start: 'top 90%', once: true, onEnter: rise });
    // Keyboard users who tab into a block before it has risen see it at once. Only for keyboard
    // focus: a mouse press also focuses, and snapping the block then would move it mid-click.
    const revealFocused = contextSafe!((event: FocusEvent) => {
      if (!(event.target as Element).matches?.(':focus-visible')) return;
      const block = risers.find(element => element.contains(event.target as Node));
      if (block) gsap.set(block, { opacity: 1, y: 0, clearProps: 'transform' });
    });
    document.addEventListener('focusin', revealFocused);

    // Skills: each group's words rise into place one after another, like type being set.
    gsap.timeline({ scrollTrigger: { trigger: '.skills-specimen', start: 'top 80%', once: true } })
      .from('.skills-group h3, .skills-intro', { opacity: 0, duration: .5 }, 0)
      .from('.skills-group li', { yPercent: 60, opacity: 0, duration: .6, ease: 'power3.out', stagger: .05, clearProps: 'transform,opacity' }, .1);

    // Shooting star: a glowing head with a fading tail travels down each ledger as it scrolls past
    // (--line, 0 to 1). Each year it passes lights up, solid gold, with a short flash.
    gsap.utils.toArray<HTMLElement>('.ledger').forEach(line => {
      const years = gsap.utils.toArray<HTMLElement>(line.querySelectorAll('.ledger-year'));
      const light = (progress: number) => {
        const head = progress * line.offsetHeight;
        years.forEach(year => {
          const lit = year.offsetTop + 24 <= head;
          if (lit === (year.dataset.lit === 'true')) return;
          year.dataset.lit = String(lit);
          if (lit) gsap.fromTo(year.querySelector('.ledger-numeral'), { scale: 1.08 }, { scale: 1, duration: .6, ease: 'back.out(3)', transformOrigin: 'left center' });
        });
      };
      gsap.fromTo(line, { '--line': 0 }, {
        '--line': 1, ease: 'none',
        scrollTrigger: { trigger: line, start: 'top 75%', end: 'bottom 65%', scrub: .6, onUpdate: self => light(self.progress) },
      });
    });

    // Lazy images and late fonts change the page height; re-measure every trigger when that happens.
    let refreshTimer = 0;
    const heightWatch = new ResizeObserver(() => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    heightWatch.observe(document.querySelector('main')!);

    return () => {
      document.removeEventListener('focusin', revealFocused);
      heightWatch.disconnect();
      window.clearTimeout(refreshTimer);
    };
  });
}

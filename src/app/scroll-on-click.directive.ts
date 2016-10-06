import { ElementRef, Directive } from '@angular/core';

@Directive({
  selector: '[appscrollOnClick]'
})
export class ScrollOnClickDirective {

  constructor(el: ElementRef) { 
      // el.nativeElement.on('click', function() {
      el.nativeElement.onclick = function() {
          // jQuery($attrs.selector).animate({scrollTop: el.nativeElement.offset().top-60}, "slow");
          // el.nativeElement.animate({scrollTop: el.nativeElement.offset().top-60}, "slow");
          el.nativeElement.animate({scrollTop: 0}, "slow");
      };
  }
}

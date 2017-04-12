/**
 * Generated from ../example/test.rba.treo by Reo 1.0.
 */
import nl.cwi.reo.runtime.java.*;

public class test {

  public static void main(String[] args) {

    Port<Object> a = new PortWaitNotify<Object>();
    Port<Object> b = new PortWaitNotify<Object>();
    Port<Object> c = new PortWaitNotify<Object>();

    Component Protocol0 = new Protocol0(a, b, c);
    Component Comp0 = new WindowConsumer("c",c);
    Component Comp1 = new WindowProducer("a",a);
    Component Comp2 = new WindowProducer("b",b);
    
 	Thread thread_Protocol0 = new Thread(Protocol0); 
 	Thread thread_Comp0 = new Thread(Comp0);
 	Thread thread_Comp1 = new Thread(Comp1);
 	Thread thread_Comp2 = new Thread(Comp2);
 	
	thread_Protocol0.start();
	thread_Comp0.start();
	thread_Comp1.start();
	thread_Comp2.start();

    try {
      thread_Protocol0.join();
      thread_Comp0.join();
      thread_Comp1.join();
      thread_Comp2.join();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

  }

  private static class Protocol0 implements Component {

  	private volatile Port<Object> a;

  	private volatile Port<Object> b;

  	private volatile Port<Object> c;

  	private Object q1;

  	public Protocol0(Port<Object> a, Port<Object> b, Port<Object> c) {
  		a.setConsumer(this);
  		b.setConsumer(this);
  		c.setProducer(this);
  		this.a = a;
  		this.b = b;
  		this.c = c;
  		activate();
  	}

  	public synchronized void activate() {
  		notify();
  	}

  	public void run() {
  		int k = 0;
  		while (true) {
  			k++;
  			if (q1 == null && c.hasGet() && a.hasPut() && b.hasPut()) {
  				c.put(a.get()); 
  				q1 = b.get(); 
  				k = 0;
  			}
  			if ((!((q1 == null))) && c.hasGet()) {
  				c.put(q1); 
  				q1 = null; 
  				k = 0;
  			}
  			if (((q1 == null)) && c.hasGet() && a.hasPut() && b.hasPut()) {
  				c.put(a.get()); 
  				q1 = b.get(); 
  				k = 0;
  			}
  			if (((q1 == null)) && c.hasGet() && a.hasPut() && b.hasPut()) {
  				c.put(a.get()); 
  				q1 = b.get(); 
  				k = 0;
  			}
  			if (k > 3) {
  				k = 0;
  				synchronized (this) {
  					try { 
  						wait(); 
  					} catch (InterruptedException e) { }
  				}	
  			}
  		}
  	}
  }


}

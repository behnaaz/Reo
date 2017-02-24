package nl.cwi.reo.interpret.sets;

import nl.cwi.reo.interpret.Scope;
import nl.cwi.reo.interpret.connectors.Semantics;
import nl.cwi.reo.interpret.instances.Instance;
import nl.cwi.reo.interpret.instances.InstanceExpression;
import nl.cwi.reo.util.Monitor;

/**
 * Interpretation of short circuit subtraction.
 * @param <T> Reo semantics type
 */
public final class SetWithout<T extends Semantics<T>> implements InstanceExpression {

	/**
	 * First set.
	 */
	private final SetComposite<T> first;

	/**
	 * Second set.
	 */
	private final SetComposite<T> second;
	
	/**
	 * Short circuit subtraction of two sets of constraints.
	 * @param first		first set
	 * @param second	second set
	 */
	public SetWithout(SetComposite<T> first, SetComposite<T> second) {
		this.first = first;
		this.second = second;
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public Instance<T> evaluate(Scope s, Monitor m) {
		Instance<T> i1 = first.evaluate(s, m);
		Instance<T> i2 = second.evaluate(s, m);
		// TODO : without set builder
		if(!i1.getConnector().isEmpty()){
			return i1;	
		}
		else
			return i2;	
	}

}
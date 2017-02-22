package nl.cwi.reo.interpret.signatures;

import nl.cwi.reo.interpret.parameters.ParameterType;
import nl.cwi.reo.interpret.terms.Terms;
import nl.cwi.reo.interpret.variables.VariableList;
import nl.cwi.reo.interpret.variables.VariableListExpression;
import nl.cwi.reo.util.Location;

/**
 * Interpretation of a component signature.
 */
public final class SignatureExpression implements ParameterType {
	
	/**
	 * List of parameters.
	 */
	private final VariableListExpression params;
	
	/**
	 * List of nodes.
	 */
	private final VariableListExpression nodes;
	
	/**
	 * Location of this signature in Reo source file.
	 */
	private final Location location;

	/**
	 * Constructs a new signature expression.
	 * @param params		list of parameters
	 * @param nodes			list of nodes
	 * @param location		location of signature in Reo source file.
	 */
	public SignatureExpression(VariableListExpression params, VariableListExpression nodes, Location location) {
		this.params = params;
		this.nodes = nodes;
		this.location = location;
	}

	/**
	 * Evaluates this interface for a given list of parameter values
	 * and a given list of ports.
	 * @param values		list of parameter values
	 * @param ports			list of ports
	 * @return signature that contains interface renaming and parameter assignments.
	 */
	public Signature evaluate(Terms values, VariableList ports) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public boolean equalType(ParameterType other) {
		// TODO Auto-generated method stub
		return false;
	}

}

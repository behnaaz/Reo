package nl.cwi.reo.interpret.interpreters;

import java.util.List;

import nl.cwi.reo.interpret.connectors.SemanticsType;
import nl.cwi.reo.interpret.listeners.ListenerPA;
import nl.cwi.reo.semantics.portautomata.PortAutomaton;
import nl.cwi.reo.util.Monitor;

public class InterpreterPA extends Interpreter<PortAutomaton> {
	
	/**
	 * Constructs a Reo interpreter for Port Automaton semantics.
	 * @param dirs		list of directories of Reo components
	 * @param params	parameter values of main component
	 * @param monitor	message container
	 */
	public InterpreterPA(List<String> dirs, List<String> params, Monitor monitor) {
		super(SemanticsType.PA, new ListenerPA(), dirs, params, monitor);	
	}	
}
